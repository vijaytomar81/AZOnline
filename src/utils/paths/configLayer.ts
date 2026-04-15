// src/utils/paths/configLayer.ts

import path from "node:path";
import { CONFIG_LAYER_DIR } from "./core";

export const CONFIG_ENVIRONMENTS_DIR = path.join(
    CONFIG_LAYER_DIR,
    "environments"
);
export const CONFIG_MODELS_DIR = path.join(
    CONFIG_LAYER_DIR,
    "models"
);
export const CONFIG_NORMALIZERS_DIR = path.join(
    CONFIG_LAYER_DIR,
    "normalizers"
);
export const CONFIG_RESOLVERS_DIR = path.join(
    CONFIG_LAYER_DIR,
    "resolvers"
);
export const CONFIG_VALIDATORS_DIR = path.join(
    CONFIG_LAYER_DIR,
    "validators"
);
export const CONFIG_TYPES_DIR = path.join(
    CONFIG_LAYER_DIR,
    "types"
);
