import { PacketType } from "../constants";
import { Badges, type BadgeDefinition } from "../definitions/badges";
import { Emotes, type EmoteDefinition } from "../definitions/emotes";
import { Loots } from "../definitions/loots";
import { type SkinDefinition } from "../definitions/skins";
import { type SuroiBitStream } from "../utils/suroiBitStream";
import { Packet } from "./packet";

export class JoinPacket extends Packet {
    override readonly allocBytes = 24;
    override readonly type = PacketType.Join;

    name!: string;
    isMobile!: boolean;

    skin!: SkinDefinition;
    badge?: BadgeDefinition;

    loginToken?: string;

    emotes: EmoteDefinition[] = [];

    override serialize(): void {
        super.serialize();
        const stream = this.stream;

        stream.writePlayerName(this.name);
        stream.writeBoolean(this.isMobile);

        Loots.writeToStream(stream, this.skin);

        const hasBadge = this.badge !== undefined;
        stream.writeBoolean(hasBadge);
        if (hasBadge) {
            Badges.writeToStream(stream, this.badge!);
        }

        for (const emote of this.emotes) {
            Emotes.writeToStream(stream, emote);
        }

        const hasToken = this.loginToken !== undefined;
        stream.writeBoolean(hasToken);
        if (hasToken) {
            stream.writeASCIIString(this.loginToken!);
        }
    }

    override deserialize(stream: SuroiBitStream): void {
        this.name = stream.readPlayerName().replaceAll(/<[^>]+>/g, "").trim(); // Regex strips out HTML

        this.isMobile = stream.readBoolean();
        this.skin = Loots.readFromStream(stream);
        this.badge = stream.readBoolean() ? Badges.readFromStream(stream) : undefined;

        for (let i = 0; i < 6; i++) {
            this.emotes.push(Emotes.readFromStream(stream));
        }

        const hasToken = stream.readBoolean();
        this.loginToken = hasToken ? stream.readASCIIString() : undefined;
    }
}
