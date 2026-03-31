// src/utils/fileFormats/xml.ts

import fs from "node:fs";
import { Builder, parseStringPromise } from "xml2js";

export async function parseXml<T = unknown>(xml: string): Promise<T> {
    try {
        return await parseStringPromise(xml);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse XML\n${message}`);
    }
}

export function buildXml(obj: unknown): string {
    const builder = new Builder({
        headless: true,
    });

    try {
        return builder.buildObject(obj);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to build XML\n${message}`);
    }
}

export async function readXmlFile<T = unknown>(
    filePath: string
): Promise<T> {
    const content = fs.readFileSync(filePath, "utf-8");
    return parseXml<T>(content);
}

export function writeXmlFile(args: {
    filePath: string;
    data: unknown;
}): void {
    const xml = buildXml(args.data);
    fs.writeFileSync(args.filePath, xml, "utf-8");
}

export async function updateXmlFile<T = unknown>(args: {
    filePath: string;
    updater: (data: T) => void | Promise<void>;
}): Promise<T> {
    const data = await readXmlFile<T>(args.filePath);

    await args.updater(data);

    writeXmlFile({
        filePath: args.filePath,
        data,
    });

    return data;
}

export async function updateXmlValue<T>(args: {
    xml: string;
    updater: (data: T) => void | Promise<void>;
}): Promise<string> {
    const data = await parseXml<T>(args.xml);

    await args.updater(data);

    return buildXml(data);
}
