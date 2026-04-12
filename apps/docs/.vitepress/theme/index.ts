/**
 * VitePress 커스텀 테마 확장.
 * 기본 테마를 상속하고 전역 컴포넌트(CardGrid, CardItem)를 등록한다.
 */

import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import CardGrid from './components/CardGrid.vue'
import CardItem from './components/CardItem.vue'
import './styles/card.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: App }) {
    app.component('CardGrid', CardGrid)
    app.component('CardItem', CardItem)
  },
}
