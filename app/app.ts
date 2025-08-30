import { baseStyle } from './app.style'
import { Div } from './base/components/native/div'
import router from './base/lib/router'
import { AboutPage } from './pages/about'
import { AddFlashcardPage } from './pages/add-flashcard'
import { EditFlashcardPage } from './pages/edit-flashcard'
import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'
import { MenuPage } from './pages/menu'
import { ReviewPage } from './pages/review'
import { BackIcon } from './pages/shared/back-icon'
import { MenuIcon } from './pages/shared/menu-icon'

const view = Div()
const app = Div()
const menuIcon = MenuIcon()
const backIcon = BackIcon()
app.append(menuIcon, backIcon, view)
app.cssClass(baseStyle)

const routes = {
    '/': HomePage,
    '/menu': MenuPage,
    '/about': AboutPage,
    '/login': LoginPage,
    '/add-flashcard': AddFlashcardPage,
    '/flashcards/edit/:id': EditFlashcardPage,
    '/review': ReviewPage
}

router.init({ routes, view })

export default app