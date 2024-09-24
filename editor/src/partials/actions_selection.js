import {e, createToolSection, toolIcon} from '../helpers'

import iconType from '../../assets/icons/type.svg'
import iconHighlighter from '../../assets/icons/highlighter.svg'
import iconPaintBucket from '../../assets/icons/paint-bucket.svg'
import iconPalette from '../../assets/icons/palette.svg'

import iconH1 from '../../assets/icons/h1.svg'
import iconH2 from '../../assets/icons/h2.svg'
import iconH3 from '../../assets/icons/h3.svg'
import iconH4 from '../../assets/icons/h4.svg'
import iconH5 from '../../assets/icons/h5.svg'
import iconH6 from '../../assets/icons/h6.svg'

import iconBold from '../../assets/icons/bold.svg'
import iconItalic from '../../assets/icons/italic.svg'
import iconStrikethrough from '../../assets/icons/strikethrough.svg'
import iconUnderline from '../../assets/icons/underline.svg'

import iconTextCenter from '../../assets/icons/text-center.svg'
import iconTextLeft from '../../assets/icons/text-left.svg'
import iconTextRight from '../../assets/icons/text-right.svg'

import iconJustifyCenter from '../../assets/icons/justify.svg'
import iconJustifyLeft from '../../assets/icons/justify-left.svg'
import iconJustifyRight from '../../assets/icons/justify-right.svg'

import iconLink from '../../assets/icons/link-45deg.svg'
import iconListUl from '../../assets/icons/list-ul.svg'
import iconListOl from '../../assets/icons/list-ol.svg'
import iconQuote from '../../assets/icons/quote.svg'

export function createActionsSelection(app) {
  return e('div', {}, [
    e('div', {className: "panel-main-header"}, ["Selection • Md"]),
    createToolSection("Text edit", [
      [
        toolIcon(iconType, "Aa FIXME"), // FIXME: What is this supposed to do?
        toolIcon(iconHighlighter, "FIXME"),
        toolIcon(iconPaintBucket, "FIXME"),
        toolIcon(iconPalette, "FIXME")
      ],
      [
        toolIcon(iconH1, "FIXME"),
        toolIcon(iconH2, "FIXME"),
        toolIcon(iconH3, "FIXME"),
        toolIcon(iconH4, "FIXME"),
        toolIcon(iconH5, "FIXME"),
        toolIcon(iconH6, "FIXME"),
      ],
      [
        toolIcon(iconBold, "FIXME"),
        toolIcon(iconItalic, "FIXME"),
        toolIcon(iconStrikethrough, "FIXME"),
        toolIcon(iconUnderline, "FIXME"),
      ],
      [
        toolIcon(iconTextLeft, "FIXME"),
        toolIcon(iconTextCenter, "FIXME"),
        toolIcon(iconTextRight, "FIXME"),
      ],
      [
        toolIcon(iconJustifyLeft, "FIXME"),
        toolIcon(iconJustifyCenter, "FIXME"),
        toolIcon(iconJustifyRight, "FIXME"),
      ]
    ]),
    createToolSection("Insert", [
      [
        toolIcon(iconLink, "FIXME"),
        toolIcon(iconListUl, "FIXME"),
        toolIcon(iconListOl, "FIXME"),
        toolIcon(iconQuote, "FIXME")
      ],
    ]),
  ])
}