<p align="center">
  <a href="" rel="noopener">
 <img src="https://www.dialogshift.com/static/v3/figma/Macbook-Mockup.png" alt="Dialogshift Webchat SDK"></a>
</p>

# Dialogshift Webchat SDK

[![npm version](https://badge.fury.io/js/dialogshift-webchat-sdk.svg)](http://badge.fury.io/js/dialogshift-webchat-sdk)

A client library for embed [DialogShift](https://www.dialogshift.com/) Webchat to webpages. Written in TypeScript and published in `UMD` and `ES2015`.

## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
- [Configuration](#сonfiguration)
- [Events](#events)
- [API Methods](#api-methods)

## About <a name = "about"></a>

DialogShift is a Conversational AI platform that helps businesses to improve the communication with their customers, enhance the customer experience and ultimately grow revenue through customer retention and automation.

Messaging is an intuitive communication tool and has the ability to bring brands much closer to their customers, increasing the engagement through more frequent 1:1 touchpoints.

Webchat SDK allow you to embed DialogShift Webchat to your webpage, customize and control chat widgets, change chating flow as you need, communicate with Conversational AI platform. Webchat widgets are fully responsive and you can use them on desktop, tablet or mobile pages. You can use SDK on native JavaScript or on TypeScript.

## Getting Started <a name = "getting-started"></a>

You can install SDK using `npm` or you can use CDN link directly. To obtain `app id` signup and copy id in [Member Area](https://member.dialogshift.com/). Read [Quick Start Guide](https://support.dialogshift.com/tutorial-quickstart/) for details.

Replace `%id%` in snippets below with your `app id` and initialize Dialogshift chat instance. Your app will interact with the DialogShift Webchat Client through the instance `Dialogshift.instance()`, which will available in your scope.

### Install from npm

Install package

```bash
npm i dialogshift-webchat-sdk --save
```

Import and initialize chat instance

```javascript
import * as Dialogshift from 'dialogshift-webchat-sdk'
import 'dialogshift-webchat-sdk/bundles/dialogshift-webchat-sdk.min.css'

const chat = Dialogshift.instance({
  id: '%id%',
})
```

### Include from CDN

Add the following code towards the end of `<head>` section of your page.

```javascript
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/dialogshift-webchat-sdk/bundles/dialogshift-webchat-sdk.umd.min.js"></script>

<link
  rel="stylesheet"
  type="text/css"
  href="https://cdn.jsdelivr.net/npm/dialogshift-webchat-sdk/bundles/dialogshift-webchat-sdk.min.css"/>
```

Add the following code towards the end of `<body>` section of your page.

```html
<script type="text/javascript">
  var chat = Dialogshift.instance({
    id: '%id%',
  })
</script>
```

## Configuration <a name = "configuration"></a>

Configuration options to pass to `Dialogshift.instance(...options)` method.

| Property          | Type              | Description                                                                                                        |
| ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| id                | string            | Chat id obtained from the [application dashboard](https://www.dialogshift.com/).                                   |
| locale?           | string            | Chat locale. Defaults to `en`.                                                                                     |
| position?         | 'left' \| 'right' | Chat position on webpage. Defaults to `right`.                                                                     |
| isChatboxVisible? | boolean           | Show chat window expanded if `true`. Defaults to `false`.                                                          |
| isButtonVisible?  | boolean           | Show toggle button if `true`. Defaults to `true`.                                                                  |
| renderButton?     | boolean           | Render toggle button if `true`. If button is not rendered show or hide it later is impossible. Defaults to `true`. |
| isTeaserVisible?  | boolean           | Show attention grabber button if `true`. Defaults to `false`.                                                      |
| buttonText?       | string            | Text for toggle button. If text is setted icon and text render at same time. Defaults to no text.                  |
| teaserText?       | string            | Text for attention grabber.                                                                                        |
| initialElement?   | string            | Trigers initial message.                                                                                           |
| unreadCounter?    | number            | Amount of unread messages.                                                                                         |

Configuration example

```javascript
const client = Dialogshift.instance({
  id: '%id%',
  locale: 'de',
  position: 'left',
  isTeaserVisible: true,
  buttonText: 'Help',
  teaserText: '👋🏻 Hi, can I help you?',
  initialElement: 'welcome-message'
  unreadCounter: 2,
})
```

## Events

You can subscribe to events to receive callbacks when events happen.
Bind and unbind methods described in section [API Methods](#api-methods).

| Name                | Payload     | Description                                                                                                                                                                                                 |
| ------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render              |             | Fires whenever the chat DOM is ready, widgets are rendered and chat config is loaded. You can call API methods but can't send messages because chat is not connected.                                       |
| ready               |             | Fires whenever the chat DOM is ready, configuration is loaded and chat connected to conversational channel. You can send messages. Mind that chat connects to conversational channel only after first open. |
| chatbox.show.before |             | Fires before the chat window is shown.                                                                                                                                                                      |
| chatbox.show        |             | Fires whenever the chat window is shown.                                                                                                                                                                    |
| chatbox.hide.before |             | Fires before the chat window is hidden.                                                                                                                                                                     |
| chatbox.hide        |             | Fires whenever the chat window is hidden.                                                                                                                                                                   |
| button.show.before  |             | Fires before the toggle button is shown.                                                                                                                                                                    |
| button.show         |             | Fires whenever the toggle button is shown.                                                                                                                                                                  |
| button.hide.before  |             | Fires before the toggle button is hidden.                                                                                                                                                                   |
| button.hide         |             | Fires whenever the toggle button is hidden.                                                                                                                                                                 |
| message.sent        | `message`   | Fires whenever a visitor sent message.                                                                                                                                                                      |
| message.received    | `message`   | Fires whenever a visitor recieved message.                                                                                                                                                                  |
| history.received    | [`message`] | Fires whenever a history is loaded.                                                                                                                                                                         |

Event `render` example

```javascript
const chat = Dialogshift.instance()

chat.instance().on('render', () => {
  console.log('Widgets are rendered')

  chat.instance().showChatbox()
})
```

Event `ready` example

```javascript
const chat = Dialogshift.instance()

chat.on('ready', () => {
  console.log('SDK connected to a channel')

  chat.triggerElement({
    successor: 'welcome-message',
  })
})
```

Event `chatbox.show` example

```javascript
const chat = Dialogshift.instance()

chat.on('chatbox.show.before', () => {
  console.log('Chat window is going to be shown')
})

chat.on('chatbox.show', () => {
  console.log('Chat window shown')
})
```

Event `message.sent` example

```javascript
const chat = Dialogshift.instance()

chat.on('message.sent', message => {
  console.log(message.requestType)
  console.log('The visitor sent message')
})
```

#### Message structure

| Name        | Description                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------- |
| requestType | Type of the sended message. Possible values `command`, `text`, `button`, `feedback`, `trigger`. |

Message contains different fields correspond to request type.

## API Methods

| Name                  | Parameters                           | Description                                                                                                                                                             |
| --------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| instance              | config chatConfig                    | Returns the chat singleton instance.                                                                                                                                    |
| on                    | string eventName, function handler   | Listen on a new event by type and handler. The handler will not be listen if it is a duplicate.                                                                         |
| once                  | string eventName, function handler   | Listen on an once event by type and handler. The handler will not be listen if it is a duplicate.                                                                       |
| off                   | string eventName?, function handler? | Listen off an event by type and handler. Or listen off events by type, when if only type argument is passed. Or listen off all events, when if no arguments are passed. |
| offAll                |                                      | Listen off all events.                                                                                                                                                  |
| showChatbox           |                                      | Show chatbox.                                                                                                                                                           |
| hideChatbox           |                                      | Hide chatbox.                                                                                                                                                           |
| showButton            |                                      | Show toggle button.                                                                                                                                                     |
| hideButton            |                                      | Hide toggle button.                                                                                                                                                     |
| setButtonText         | string text                          | Change toggle button text. `text` could be an empty string.                                                                                                             |
| showTeaser            |                                      | Show teaser.                                                                                                                                                            |
| hideTeaser            |                                      | Hide teaser.                                                                                                                                                            |
| setTeaserText         | string text                          | Change teaser text.                                                                                                                                                     |
| setPosition           | 'left' \| 'right'                    | Change chat container position.                                                                                                                                         |
| setContext            | string key, any value                | Set context variable for visitor.                                                                                                                                       |
| getContext            | string key                           | Returns context variable.                                                                                                                                               |
| getVisitor            |                                      | Returns current visitor.                                                                                                                                                |
| getConfig             |                                      | Returns chat config.                                                                                                                                                    |
| setUnreadCounter      | number amout                         | Set value to unread counter widget. If `amount = 0` widget will be hidden.                                                                                              |
| increaseUnreadCounter | number amout                         | Increase value to unread counter widget.                                                                                                                                |

Show teaser example

```javascript
import * as Dialogshift from 'dialogshift-webchat-sdk'

const client = Dialogshift.instance({
  id: '%id%',
})

client.showTeaser()
```

## Getting Help

Please use [Github issue tracker](https://github.com/dialogshift/dialogshift-webchat-sdk/issues) for questions, feature requests, bug reports or email us to support@dialogshift.com
