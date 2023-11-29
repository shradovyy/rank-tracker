import { shallowRef } from "vue";
import { v4 as uuidv4 } from 'uuid'

export default class Modal {

    constructor(options) {
        this.title = options.title || null;
        this.description = options.description;
        this.buttons = {
            confirm: options.confirm || 'Confirm',
            cancel: options.cancel || 'Cancel'
        }
        this.width = options.width || null;
        this.props = options.props || {};
        if(options.hideCancelButton) this.hideCancelButton = true;
        else this.hideCancelButton = false;
        this.component = options.component ? shallowRef(options.component) : null;
        this.callback = {
            close: []
        };

        if(options.extraLink) {
            this.extraLink = { text: 'Link name', callback: null };
            if(options.extraLink.text) {
                this.extraLink.text = options.extraLink.text;
            }
            if(options.extraLink.callback) {
                this.extraLink.callback = options.extraLink.callback;
            }
        }

        this.modalId = uuidv4();
        return this;
    }

    processing(value) {
        this.isProcessing = value;
    }

    setProp(name, value) {
        this.props[name] = value;
    }

    onConfirm(callback) {
        this.callback.confirm = callback;
    }

    onCancel(callback) {
        this.callback.cancel = callback;
    }

    onClose(callback) {
        this.callback.close.push(callback);
    }

    cancel() {
        if(this.callback.cancel) this.callback.cancel();
        this.close();
    }

    close(success = false, data = {}) {
        this.closed = true;
        for(const callback of this.callback.close) {
            callback(success, data);
        }
    }



    extraLinkCallback() {

    }

}