import obfuscator from "rollup-plugin-obfuscator";
import { mergeConfig, type UserConfig } from "vite";

import common from "./vite.common";

const config: UserConfig = {
    define: {
        API_URL: JSON.stringify("/api")
    },

    plugins: [
        obfuscator({
            global: true,
            options: {
                target: "browser"
            }
        })
    ]
};

export default mergeConfig(common, config);
