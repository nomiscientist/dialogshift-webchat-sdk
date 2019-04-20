import { config } from '../config/config'
import { EventEmitter } from './event-emitter'
import {
  WrapperWidget,
  ButtonWidget,
  ChatboxWidget,
  IframeWidget,
  TeaserWidget,
} from '../widgets/index'

export enum ChatPosition {
  left = 'left',
  right = 'right',
}

export interface AppOptions {
  id: string
  visitorId?: string
  locale?: string
  position?: ChatPosition
  isChatboxVisible?: boolean
  isButtonVisible?: boolean
  isTeaserVisible?: boolean
  renderButton?: boolean
  buttonText?: string
  teaserText?: string
  showFooter?: boolean
}

const appOptionsDefault = {
  locale: 'en',
  position: ChatPosition.right,
  isChatboxVisible: false,
  isButtonVisible: true,
  isTeaserVisible: false,
  renderButton: true,
  showFooter: true,
  teaserText: '👋🏻 Hi, can I help you?',
}

export enum ActionEventType {
  'action' = 'action',
  'message' = 'message',
}

export interface ActionEvent {
  type: ActionEventType
  name: string
  payload: { [key: string]: any }
}

export class App {
  private options: AppOptions
  private wrapperWidget: WrapperWidget
  private buttonWidget: ButtonWidget
  private chatboxWidget: ChatboxWidget
  private iframeWidget: IframeWidget
  private teaserWidget: TeaserWidget
  private broadcast: EventEmitter

  constructor(options: AppOptions) {
    if (!options) {
      throw Error('Please provide Dialogshift chat configuration')
    }

    if (!options.id) {
      throw Error('Dialogshift chat id is undefined.')
    }

    this.options = Object.assign(appOptionsDefault, options)

    this.broadcast = new EventEmitter()

    this.render()
    this.bindEvents()
  }

  private render() {
    this.renderWrapperWidget()

    if (this.options.renderButton) {
      this.renderButtonWidget()
    }

    this.createIframeWidget()
    this.renderChatboxWidget()
    this.renderTeaserWidget()
  }

  private bindEvents() {
    window.addEventListener('message', event => {
      if (event.origin === config.iframeHost) {
        const message = event.data as ActionEvent

        if (message.type === ActionEventType.message) {
          this.broadcast.fire(message.name, message.payload)
        }
      }
    })
  }

  private renderChatboxWidget() {
    this.chatboxWidget = new ChatboxWidget({
      visible: this.options.isChatboxVisible,
      events: [
        {
          type: 'before:show',
          callback: () => {
            this.broadcast.fire('chatbox.show.before')

            this.teaserWidget.hide()

            if (this.buttonWidget) {
              this.buttonWidget.setState('active')
            }

            if (!this.iframeWidget.isRendered()) {
              this.iframeWidget.render(this.chatboxWidget.getBoxElem())
            }

            if (!this.iframeWidget.isLoaded()) {
              this.iframeWidget.load()
            }
          },
        },
        {
          type: 'show',
          callback: () => this.broadcast.fire('chatbox.show'),
        },
        {
          type: 'before:hide',
          callback: () => {
            this.broadcast.fire('chatbox.hide.before')

            if (this.options.isTeaserVisible) {
              this.teaserWidget.show()
            }

            this.buttonWidget.setState('default')
          },
        },
        {
          type: 'hide',
          callback: () => {
            this.broadcast.fire('chatbox.hide')
          },
        },
      ],
    })

    this.chatboxWidget.render(this.wrapperWidget.getBoxElem())

    this.broadcast.on('ready', () => {
      this.chatboxWidget.setState('ready')
    })
  }

  private renderButtonWidget() {
    this.buttonWidget = new ButtonWidget({
      text: this.options.buttonText,
      renderTo: this.wrapperWidget.getBoxElem(),
      visible: this.options.isButtonVisible,
      events: [
        {
          type: 'toggle',
          callback: event => {
            event.data.isPressed
              ? this.chatboxWidget.show()
              : this.chatboxWidget.hide()
          },
        },
        {
          type: 'before:show',
          callback: event => this.broadcast.fire('button.show.before'),
        },
        {
          type: 'show',
          callback: event => this.broadcast.fire('button.show'),
        },
        {
          type: 'before:hide',
          callback: event => this.broadcast.fire('button.hide.before'),
        },
        {
          type: 'hide',
          callback: event => this.broadcast.fire('button.hide'),
        },
      ],
    })
  }

  private renderWrapperWidget() {
    this.wrapperWidget = new WrapperWidget({
      renderTo: document.body,
      position: this.options.position,
    })

    if (!this.options.renderButton) {
      this.wrapperWidget.addCls(config.wrapperNoButtonCls)
    }
  }

  private createIframeWidget() {
    this.iframeWidget = new IframeWidget({
      host: config.iframeHost,
      id: this.options.id,
    })
  }

  private renderTeaserWidget() {
    this.teaserWidget = new TeaserWidget({
      renderTo: this.wrapperWidget.getBoxElem(),
      text: this.options.teaserText,
      visible: this.options.isTeaserVisible,
      events: [
        {
          type: 'before:show',
          callback: event => this.broadcast.fire('teaser.show.before'),
        },
        {
          type: 'show',
          callback: event => this.broadcast.fire('teaser.show'),
        },
        {
          type: 'before:hide',
          callback: event => this.broadcast.fire('teaser.hide.before'),
        },
        {
          type: 'hide',
          callback: event => this.broadcast.fire('teaser.hide'),
        },
      ],
    })
  }

  getBroadcast(): EventEmitter {
    return this.broadcast
  }

  getWrapperWidget(): WrapperWidget {
    return this.wrapperWidget
  }

  getChatboxWidget(): ChatboxWidget {
    return this.chatboxWidget
  }

  getButtonWidget(): ButtonWidget {
    return this.buttonWidget
  }

  getTeaserWidget(): TeaserWidget {
    return this.teaserWidget
  }
}
