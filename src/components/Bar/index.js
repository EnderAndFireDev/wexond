import Component from '../../classes/Component'
import Network from '../../helpers/Network'

export default class Bar extends Component {
  onShortUrlClick = (e) => {
    e.stopPropagation()
    if (!this.isAddressbarBarToggled) {
      this.retrieveInformation(app.getSelectedPage().elements.webview.getURL())
      this.toggleInput(true)
    }
  }

  onFocus = (e) => {
    this.elements.input.setSelectionRange(0, this.elements.input.value.length)
  }

  onKeyPress = (e) => {
    if (e.which === 13) {
      e.preventDefault()
      const page = app.getSelectedPage()
      const webview = page.elements.webview
      const inputText = this.elements.input.value

      let URLToNavigate = inputText

      if (Network.isURL(e.currentTarget.value)) {
        if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'http://' + inputText
      } else {
        if (e.currentTarget.value.indexOf('://') === -1) URLToNavigate = 'https://www.google.com/search?q=' + inputText
      }

      webview.loadURL(URLToNavigate)

      app.getSelectedTab().getWebView().loadURL(this.elements.input.value)

      this.toggleInput(false)
    }
  }

  render () {
    return (
      <div className='bar' ref='bar'>
        <div ref='back' className='bar-icon bar-icon-back' />
        <div ref='forward' className='bar-icon bar-icon-forward' />
        <div ref='refresh' className='bar-icon bar-icon-refresh' />
        <div ref='addressbar' className='bar-addressbar'>
          <div ref='icon' className='bar-addressbar-icon bar-addressbar-icon-secure' />
          <div ref='certificateName' className='bar-addressbar-certificate-name' />
          <div className='bar-addressbar-divider' />
          <div ref='shortUrl' onClick={this.onShortUrlClick} className='bar-addressbar-shorturl' />
          <div ref='actionIcons' className='bar-addressbar-action-icons'>
            <div className='bar-addressbar-action-icon bar-addressbar-action-icon-favorite' />
            <div ref='clear' className='bar-addressbar-action-icon bar-addressbar-action-icon-clear' />
          </div>
          <input ref='input' onFocus={this.onFocus} onKeyPress={this.onKeyPress} className='bar-input' />
        </div>
        <div ref='menu' className='bar-icon bar-icon-menu' />
      </div>
    )
  }

  afterRender () {
    const self = this

    window.addEventListener('mousedown', function (e) {
      if (self.isAddressbarBarToggled) self.toggleInput(false)
    })

    this.elements.back.addEventListener('click', (e) => {
      const webview = app.getSelectedPage().elements.webview

      if (webview.canGoBack()) {
        webview.goBack()
      }
    })

    this.elements.forward.addEventListener('click', (e) => {
      const webview = app.getSelectedPage().elements.webview

      if (webview.canGoForward()) {
        webview.goForward()
      }
    })

    this.elements.refresh.addEventListener('click', (e) => {
      const webview = app.getSelectedPage().elements.webview

      webview.reload()
    })

    this.elements.menu.addEventListener('click', (e) => {
      const menu = app.elements.menu

      if (menu.isMenuToggled) {
        menu.hide()
      } else {
        menu.show()
        menu.elements.menu.css({
          right: 16,
          top: 64,
          left: 'auto'
        })
      }
    })

    this.elements.input.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })

    this.elements.addressbar.addEventListener('mouseenter', (e) => {
      self.elements.actionIcons.css({
        opacity: 1,
        pointerEvents: 'auto'
      })
    })

    this.elements.addressbar.addEventListener('mouseleave', (e) => {
      if (!self.isAddressbarBarToggled) {
        self.elements.actionIcons.css({
          opacity: 0,
          pointerEvents: 'none'
        })
      }
    })

    this.elements.clear.addEventListener('click', (e) => {
      self.elements.input.value = ''
      if (!self.isAddressbarBarToggled) {
        self.toggleInput(true)
      }
      self.elements.input.focus()
    })

    this.elements.actionIcons.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })
  }

  setCertificateName (name, country = null) {
    let certificateName = name
    if (country != null) {
      certificateName += ' [' + country + ']'
    }
    this.elements.certificateName.textContent = certificateName
  }

  setDomain (url) {
    this.elements.shortUrl.textContent = this.getDomain(url)
  }

  getDomain (url) {
    let hostname = url

    if (hostname.indexOf('http://') !== -1 || hostname.indexOf('https://') !== -1) {
      hostname = hostname.split('://')[1]
    }

    if (hostname.indexOf('?') !== -1) {
      hostname = hostname.split('?')[0]
    }

    if (hostname.indexOf('://') !== -1) {
      hostname = hostname.split('://')[0] + '://' + hostname.split('/')[2]
    } else {
      hostname = hostname.split('/')[0]
    }

    return hostname
  }

  toggleInput (flag) {
    const self = this

    this.isAddressbarBarToggled = flag

    this.elements.input.css({
      opacity: (flag) ? 1 : 0,
      pointerEvents: (flag) ? 'auto' : 'none'
    })

    this.elements.actionIcons.css({
      float: (flag) ? 'right' : 'none',
      position: (flag) ? 'relative' : 'absolute',
      opacity: (flag) ? 1 : 0,
      pointerEvents: (flag) ? 'auto' : 'none',
      marginRight: (flag) ? 11 : 0
    })

    if (flag) {
      this.elements.input.focus()
    }
  }

  retrieveInformation (url) {
    const self = this
    this.elements.input.value = url
    this.setDomain(url)

    let options = {
      host: this.getDomain(url),
      port: 443,
      method: 'GET'
    }

    let req = https.request(options, (res) => {
      let certificate = res.connection.getPeerCertificate()

      if (certificate.subject == null) return

      this.elements.icon.classList.remove('bar-addressbar-icon-info')
      this.elements.icon.classList.remove('bar-addressbar-icon-wexond')
      this.elements.icon.classList.add('bar-addressbar-icon-secure')
      self.setCertificateName(certificate.subject.O, certificate.subject.C)

      self.isHttps = true
    })

    req.on('error', (e) => {
      this.elements.icon.classList.remove('bar-addressbar-icon-wexond')
      this.elements.icon.classList.remove('bar-addressbar-icon-secure')

      if (url.startsWith('wexond')) {
        self.isHttps = true
        this.elements.icon.classList.remove('bar-addressbar-icon-info')
        this.elements.icon.classList.add('bar-addressbar-icon-wexond')
        self.setCertificateName('Wexond')
      } else {
        self.isHttps = false
        this.elements.icon.classList.add('bar-addressbar-icon-info')
        self.setCertificateName('')
      }
    })

    req.end()
  }

  updateNavigationIcons () {
    const webview = app.getSelectedPage().elements.webview

    if (webview.canGoBack()) {
      this.elements.back.classList.remove('bar-icon-disabled')
    } else {
      this.elements.back.classList.add('bar-icon-disabled')
    }

    if (webview.canGoForward()) {
      this.elements.forward.classList.remove('bar-icon-disabled')
    } else {
      this.elements.forward.classList.add('bar-icon-disabled')
    }
  }
}