import os from "node:os";

export default function system_arch() {
    return { arch: String(os.arch()) };
}
