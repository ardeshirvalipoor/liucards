import { Div } from "../../../base/components/native/div";
import router from "../../../base/lib/router";
import { PlusIcon } from "../../shared/plus-icon";
import { baseStyle } from "./header.style";

export const HomeHeader = () => {

    const base = Div()
    base.cssClass(baseStyle)

    const plus = PlusIcon()
    base.append(plus)
    plus.el.onclick = () => router.goto('/add-flashcard')

    return base
}

