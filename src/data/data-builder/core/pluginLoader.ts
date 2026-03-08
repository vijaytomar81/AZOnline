// src/data/data-builder/core/pluginLoader.ts

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { createRequire } from "node:module";

import type { PipelineContext, PipelinePlugin } from "./pipeline";
import type { Logger } from "../types";

type DiscoveredPlugin = {
    file: string;
    plugin: PipelinePlugin;
};

/**
 * Helper: is a file a JS/TS plugin candidate?
 */
function isTsOrJs(file: string) {
    return file.endsWith(".ts") || file.endsWith(".js");
}

/**
 * Pick plugin export from a module:
 * - default export preferred
 * - else any named export that looks like a plugin object
 */
function pickPluginExport(mod: any): PipelinePlugin | null {
    const candidateDefault = mod?.default;
    if (isPipelinePlugin(candidateDefault)) return candidateDefault;

    for (const k of Object.keys(mod ?? {})) {
        const v = mod[k];
        if (isPipelinePlugin(v)) return v;
    }
    return null;
}

function isPipelinePlugin(v: any): v is PipelinePlugin {
    return (
        v &&
        typeof v === "object" &&
        typeof v.name === "string" &&
        typeof v.run === "function"
    );
}

/**
 * Loads plugins from a folder (no execution here).
 * Uses logger so timestamps/prefix are consistent.
 */
export async function loadPluginsFromFolder(opts: {
    pluginsDirAbs: string;
    verbose?: boolean;
    onlyNames?: string[]; // optional allowlist
    log?: Logger;
}): Promise<DiscoveredPlugin[]> {
    const { pluginsDirAbs, verbose = false, onlyNames, log } = opts;

    if (!fs.existsSync(pluginsDirAbs)) {
        throw new Error(`Plugins folder not found: ${pluginsDirAbs}`);
    }

    const files = fs
        .readdirSync(pluginsDirAbs)
        .filter((f) => isTsOrJs(f))
        .map((f) => path.join(pluginsDirAbs, f));

    const discovered: DiscoveredPlugin[] = [];

    /**
     * ✅ IMPORTANT:
     * Avoid import.meta.url because your TS module setting is not ESM.
     * Use a real file path to create a require() function.
     */
    const requireFromProject = createRequire(path.join(process.cwd(), "package.json"));

    for (const fileAbs of files) {
        let mod: any;

        // Try dynamic import, fallback to require
        try {
            const fileUrl = url.pathToFileURL(fileAbs).href;
            mod = await import(fileUrl);
        } catch (e1: any) {
            try {
                mod = requireFromProject(fileAbs);
            } catch (e2: any) {
                const msg1 = e1?.message ?? String(e1);
                const msg2 = e2?.message ?? String(e2);
                throw new Error(
                    `Failed to load plugin file: ${fileAbs}\n- import(): ${msg1}\n- require(): ${msg2}`
                );
            }
        }

        const plugin = pickPluginExport(mod);
        if (!plugin) {
            if (verbose) log?.debug?.(`Skipping ${path.basename(fileAbs)} (no plugin export found)`);
            continue;
        }

        if (onlyNames && onlyNames.length > 0 && !onlyNames.includes(plugin.name)) {
            if (verbose) log?.debug?.(`Skipping ${plugin.name} (not in onlyNames allowlist)`);
            continue;
        }

        discovered.push({ file: fileAbs, plugin });
    }

    // Hard stop if duplicate plugin names exist
    const names = discovered.map((d) => d.plugin.name);
    const dup = names.filter((n, i) => names.indexOf(n) !== i);
    if (dup.length > 0) {
        const uniq = Array.from(new Set(dup));
        throw new Error(`Duplicate plugin name(s): ${uniq.join(", ")}`);
    }

    if (verbose) {
        log?.debug?.(`Discovered plugins (${discovered.length}):`);
        for (const d of discovered) {
            log?.debug?.(`- name=${d.plugin.name} file=${path.basename(d.file)}`);
        }
    }

    return discovered;
}

/**
 * Executes plugins in the correct order.
 * Order rules:
 * - Dependency graph based on requires/provides (ignores external:*)
 * - Topological sort
 * - Tie-breaker: order asc, then name
 */
export async function runDiscoveredPlugins(
    ctx: PipelineContext,
    plugins: PipelinePlugin[]
) {
    const ordered = resolveRunOrderOrThrow(plugins);

    ctx.log.info(`Run order: ${ordered.map((p) => p.name).join(" -> ")}`);

    for (const p of ordered) {
        ctx.log.info(`Plugin start: ${p.name}`);
        const started = Date.now();

        await p.run(ctx);

        const ms = Date.now() - started;
        ctx.log.info(`Plugin done: ${p.name} (${(ms / 1000).toFixed(2)}s)`);
    }

    return ordered.map((p) => p.name);
}

/* -------------------- ORDER RESOLUTION (graph) -------------------- */

function isExternal(req: string) {
    return req.startsWith("external:");
}

function resolveRunOrderOrThrow(all: PipelinePlugin[]): PipelinePlugin[] {
    // Map: token -> single provider plugin name
    const providers = new Map<string, string>();

    for (const p of all) {
        for (const token of p.provides ?? []) {
            const existing = providers.get(token);
            if (existing && existing !== p.name) {
                // strict: only 1 provider per token
                throw new Error(`Multiple providers for token "${token}": ${existing}, ${p.name}`);
            }
            providers.set(token, p.name);
        }
    }

    // Build adjacency
    const deps = new Map<string, Set<string>>(); // plugin -> dependsOn names
    const out = new Map<string, Set<string>>();  // plugin -> outgoing dependents
    const byName = new Map<string, PipelinePlugin>();

    for (const p of all) {
        byName.set(p.name, p);
        deps.set(p.name, new Set());
        out.set(p.name, new Set());
    }

    // Add edges based on requires
    for (const p of all) {
        for (const req of p.requires ?? []) {
            if (isExternal(req)) continue; // CLI-provided; no edge required

            const providerName = providers.get(req);
            if (!providerName) {
                throw new Error(`No provider found for required token "${req}" required by "${p.name}"`);
            }
            if (providerName === p.name) continue;

            deps.get(p.name)!.add(providerName);
            out.get(providerName)!.add(p.name);
        }
    }

    // Kahn topo-sort with tie-breaking (order then name)
    const indeg = new Map<string, number>();
    for (const [name, incoming] of deps.entries()) indeg.set(name, incoming.size);

    const available: string[] = [];
    for (const [name, d] of indeg.entries()) if (d === 0) available.push(name);

    const result: string[] = [];

    while (available.length > 0) {
        available.sort((a, b) => {
            const pa = byName.get(a)!;
            const pb = byName.get(b)!;
            const oa = pa.order ?? 0;
            const ob = pb.order ?? 0;
            if (oa !== ob) return oa - ob;
            return a.localeCompare(b);
        });

        const n = available.shift()!;
        result.push(n);

        for (const next of out.get(n) ?? []) {
            const newDeg = (indeg.get(next) ?? 0) - 1;
            indeg.set(next, newDeg);
            if (newDeg === 0) available.push(next);
        }
    }

    if (result.length !== all.length) {
        const remaining = all.map((p) => p.name).filter((n) => !result.includes(n));
        throw new Error(`Cycle detected among: ${remaining.join(" -> ")}`);
    }

    return result.map((n) => byName.get(n)!);
}