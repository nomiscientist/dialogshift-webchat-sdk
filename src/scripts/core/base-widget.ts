import { Observable, ObservableOptions } from './observable'

export interface BaseWidgetOptions extends ObservableOptions {
  visible?: boolean
  baseCls?: string
  renderTo?: HTMLElement
  animationDelay?: number
}

export class BaseWidget extends Observable {
  private visible = true
  private baseCls = ''
  private renderTo: HTMLElement
  private animationDelay = 250
  private boxElem: HTMLElement

  constructor(options: BaseWidgetOptions) {
    super({ events: options.events })

    Object.assign(this, options)

    if (this.renderTo) {
      this.render()
    }
  }

  isVisible(): boolean {
    return this.visible
  }

  getBaseCls(): string {
    return this.baseCls
  }

  createNode(): HTMLElement {
    return document.createElement('div')
  }

  getBoxElem(): HTMLElement {
    if (!this.boxElem) {
      this.boxElem = this.createNode()

      if (this.getBaseCls()) {
        this.boxElem.classList.add(this.getBaseCls())
      }
    }

    return this.boxElem
  }

  render(renderTo?: HTMLElement) {
    if (!renderTo && !this.renderTo) {
      throw Error('Please provide parent node to render widget')
    }

    if (this.isRendered()) {
      return
    }

    let renderToNode = this.renderTo
    if (renderTo) {
      renderToNode = renderTo
    }

    this.fire('before:render')

    const boxElem = this.getBoxElem()

    if (!this.visible) {
      boxElem.style.display = 'none'
      boxElem.style.opacity = '0'
    }

    renderToNode.appendChild(boxElem)

    this.fire('render')

    if (this.visible) {
      this.visible = false
      this.show()
    }
  }

  isRendered(): boolean {
    return this.boxElem && document.body.contains(this.boxElem)
  }

  show() {
    if (this.isVisible()) {
      return
    }

    this.fire('before:show')
    this.visible = true

    const boxElem = this.getBoxElem()
    boxElem.style.display = 'block'

    setTimeout(() => {
      boxElem.style.opacity = '1'
    })
    setTimeout(() => this.fire('show'), this.animationDelay)
  }

  hide() {
    if (!this.isVisible()) {
      return
    }

    this.fire('before:hide')
    this.visible = false

    const boxElem = this.getBoxElem()
    boxElem.style.opacity = '0'

    setTimeout(() => {
      boxElem.style.display = 'none'

      this.fire('hide')
    },         this.animationDelay)
  }

  addCls(cls: string) {
    this.getBoxElem().classList.add(cls)
  }

  removeCls(cls: string) {
    this.getBoxElem().classList.remove(cls)
  }
}
