<style lang="less">
  .quill-editor-wrapper {

    .ql-editor {
      height: 300px;
    }

    img {
      max-width: 100%
    }

    .ql-snow {
      text-align: left;
      line-height: 1;
    }

  }
</style>

<template>
  <div class="quill-editor-wrapper">
    <slot name="toolbar"></slot>
    <div ref="editor" :id="editorId" class="quill-editor"></div>
    <input type="file" :id="fileId" multiple="multiple" style="display: none"/>
  </div>
</template>

<script>
/*eslint-disable*/
import Quill from 'quill'
import Axios from 'axios'

require('quill/dist/quill.snow.css')
require('quill/dist/quill.bubble.css')
require('quill/dist/quill.core.css')

export default {
  name: 'quill-editor',
  props: {
    value: String,
    disabled: Boolean,
    options: {
      type: Object,
      height: '180px',
      required: false,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      fileId: `file_${Math.random() * 100000000000000000}`,
      editorId: `editor_${Math.random() * 100000000000000000}`,
      fileInput: '',
      _content: '',
      defaultModules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ['image'],
          ['clean']
        ]
      }
    }
  },
  mounted() {
    this.initImageUploader()
    this.initialize()
  },
  beforeDestroy() {
    this.quill = null
  },
  methods: {
    initialize() {
      if (this.$el) {
        // options and instance
        const self = this
        this.options.theme = this.options.theme || 'snow'
        this.options.boundary = this.options.boundary || document.body
        this.options.modules = this.options.modules || this.defaultModules
        this.options.modules.toolbar = this.options.modules.toolbar !== undefined
          ? this.options.modules.toolbar
          : this.defaultModules.toolbar
        this.options.placeholder = this.options.placeholder || '请输入...'
        this.options.readOnly = this.options.readOnly !== undefined ? this.options.readOnly : false

        var Image = Quill.import('formats/image')
        Image.className = 'quill-img'
        Quill.register(Image, true)

        this.quill = new Quill(this.$refs.editor, this.options)
        // set editor content
        if (this.value || this.content) {
          this.quill.pasteHTML(this.value || this.content)
        }
        // mark model as touched if editor lost focus
        this.quill.on('selection-change', (range) => {
          if (!range) {
            self.$emit('blur', self.quill)
          } else {
            self.$emit('focus', self.quill)
          }
        })

        this.quill.on('text-change', (delta, oldDelta, source) => {
          let html = this.quill.root.innerHTML
          const text = this.quill.getText()
          if (html === '<p><br></p>') html = ''
          this._content = html
          this.$emit('input', this._content)
          this.$emit('change', {
            editor: this.quill,
            html,
            text
          })
        })
        this.quill.getModule('toolbar').addHandler('image', this.imageHandler)

        this.$emit('ready', self.quill)
      }
    },
    initImageUploader() {
      this.fileInput = document.getElementById(this.fileId)
      this.fileInput.setAttribute('type', 'file')
      this.fileInput.setAttribute('accept', 'image/*')
      this.fileInput.classList.add('ql-image')
      this.fileInput.addEventListener('change', (e) => {
        const files = e.target.files
        console.log('files', files)
        this.$Spin.show()
        if (files != null && files.length > 0) {
          const promises = Array.prototype.map.call(files, (v => {
            return this.genUploadPromise(v)
          }))
          Promise.all(promises).then(ret => {
            if (ret && ret.length > 0) {
              ret.forEach(res => {
                const { url } = res.data.data
                const range = this.quill.getSelection(true)
                this.quill.insertEmbed(range.index, 'image', url)
              })
            }
            this.$Spin.hide()
          }).catch(() => {
            this.$Spin.hide()
            setTimeout(() => {
              this.$Message.error('上传失败！')
            }, 1000)
          })
          this.fileInput.value = ''
        }
      })
    },
    genUploadPromise(file) {
      if (!file) return Promise.resolve()
      let data = new FormData()
      data.append('file', file)
      return Axios.post(`${this.$config.API_URL}/sys/upload`, data, {
        headers: {
          'token': this.$localStore.get('token') || ''
        }
      })
    },
    imageHandler() {
      this.fileInput.click()
    },
    image2base64() {
      const editor = document.getElementById(this.editorId).getElementsByClassName('ql-editor')[0]
      if (!editor) {
        return
      }

      const imgs = editor.getElementsByTagName('img')
      if (!imgs || imgs.length === 0) {
        return
      }

      imgs.forEach((img) => {
        const type = img.getAttribute('data-type')
        if (type !== 'base64') {
          return false
        }
        /*
           image2base64.base64(
           'http://cdn.pingwest.com/wp-content/uploads/2017/07/f0jr-fyiavtv6779878.jpg?imageView2/2/w/750/q/90',
           data => {
           img.removeAttribute('data-type')
           })
           */
      })
    }
  },
  watch: {
    content(newVal, oldVal) {
      if (this.quill) {
        if (!!newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    value(newVal, oldVal) {
      if (this.quill) {
        if (!!newVal && newVal !== this._content) {
          this._content = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    disabled(newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    }
  }
}
</script>
