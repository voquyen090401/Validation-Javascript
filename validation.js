const { typeOf } = require("./core/utils")
const EMAIL_REGEX = /^\w+(\.?\w+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const PHONE_REGEX = /^0[1-9]{1}[0-9]{1}[- .]?[0-9]{3}[- .]?[0-9]{4}$/
const USERNAME_REGEX = /^[a-zA-Z0-9]+$/
const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
const URL_REGEX = new RegExp('^(https?:\\/\\/)?' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$', 'i');
const MAP_REGEX = /^https:\/\/www\.google\.com\/maps/

class ValidationFactory {
    static validateRegistry = {}

    static create(key, funcRef) {
        ValidationFactory.validateRegistry[key] = funcRef
    }

    static get(key) {
        return ValidationFactory.validateRegistry[key]
    }
}

class FieldValidation {
    static validate = ({ value, require, message, validate }) => {
        if (require) {
            if (Validation.isEmpty(value))
                return ValidationFactory.get("msg_empty")(message)
        }

        if (validate) {
            if (!require && Validation.isEmpty(value)) return ''

            if (!ValidationFactory.get(validate)(value)) {
                return ValidationFactory.get("msg_format")(message)
            }
        }

        return ''
    }
    static isEmpty = (value) => !ValidationFactory.get(typeOf(value))(value)
}

class FormValidation {
    static validateForm(data, fields) {
        for (let obj of fields) {
            const { callback, message, validate, value, require } = {
                require: true,
                value: data[obj.field],
                ...obj
            }

            const msg = callback
                ? callback(data)
                : FieldValidation.validate({ value, require, message, validate })

            if (!msg) continue

            return msg
        }

        return ''
    }
}

class Validation {
    static validateForm = (data, fields) => FormValidation.validateForm(data, fields)
    static isEmpty = (value) => FieldValidation.isEmpty(value)
    static emptyError = (message) => ValidationFactory.get('msg_empty')(message)
    static formatError = (message) => ValidationFactory.get('msg_format')(message)
}

// Create Method Validation
ValidationFactory.create('phone', (value) => PHONE_REGEX.test(value.trim()))
ValidationFactory.create('email', (value) => EMAIL_REGEX.test(value.trim()))
ValidationFactory.create('url', (value) => URL_REGEX.test(value.trim()))
ValidationFactory.create('username', (value) => USERNAME_REGEX.test(value.trim()))
ValidationFactory.create('youtube', (value) => YOUTUBE_REGEX.test(value.trim()))
ValidationFactory.create('map', (value) => MAP_REGEX.test(value.trim()))

ValidationFactory.create('number', (value) => value >= 0)
ValidationFactory.create('string', (value) => value.trim().length > 0)
ValidationFactory.create('array', (value) => value.length > 0)
ValidationFactory.create('object', (value) => Object.keys(value).length > 0)
ValidationFactory.create('null', () => false)
ValidationFactory.create('undefined', () => false)
ValidationFactory.create('boolean', (value) => value === false || value === true)

ValidationFactory.create('msg_empty', (message) => `${message} không được trống!`)
ValidationFactory.create('msg_format', (message) => `${message} không đúng định dạng!`)

Validation.matchUrlRegex = (value) => ValidationFactory.get('url')(value)
Validation.matchEmailRegex = (value) => ValidationFactory.get('email')(value)
Validation.matchPhoneRegex = (value) => ValidationFactory.get('phone')(value)

module.exports = { Validation }
