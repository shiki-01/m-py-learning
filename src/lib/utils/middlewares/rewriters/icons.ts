import Icon from "@iconify/svelte";

export function injectIconify(): void {
    if (document == null) {
        throw new Error(
            "document is not defined. This fn should be called after `onMount`",
        );
    }

    const icons = document.querySelectorAll("span.icon");

    icons.forEach((elem) => {
        const name = elem.textContent;
        if (name == null) {
            throw new Error("icon is not found");
        }

        const icon = name;

        new Icon({
            target: elem,
            hydrate: true,
            props: { icon },
        });
    });
}