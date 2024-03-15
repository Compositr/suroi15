export const Config = {
    regions: {
        dev: { name: "Local Server", address: "127.0.0.1:63333", https: false },
        dev1v1: { name: "Local Server 1v1", address: "127.0.0.1:63334", https: false },
        sg: { name: "Singapore", address: "suroi15.dafox.box.ca", https: true },
        nj: { name: "New Jersey", address: "islandrain.compositr.dev", https: true },
        sg1v1: { name: "Singapore (1v1)", address: "suroi15-sg1v1.dafox.box.ca", https: true },
        nj1v1: { name: "New Jersey (1v1)", address: "suroi15-nj1v1.compositr.dev", https: true }
    },
    defaultRegion: "nj",
    mode: "desert"
} satisfies ConfigType as ConfigType;

export interface ConfigType {
    readonly regions: Record<string, {
        readonly name: string
        readonly address: string
        readonly https: boolean
    }>
    readonly defaultRegion: string
    readonly mode: string
}
