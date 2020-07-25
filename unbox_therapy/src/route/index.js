import home from '../views/home.svelte'
import home2 from '../views/home2.svelte'
import Explainer from '../views/Explainer.svelte'
import Knn from '../views/Knn.svelte'
import Tree from '../views/Tree.svelte'
import startpage from '../views/startpage.svelte'

export const routes = {
  '/': startpage,
  '/home': home2,
  '/cnn': Explainer,
  '/knn': Knn,
  '/tree': Tree,
  '/old': home
}