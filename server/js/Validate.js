const moment = require("moment");
const fs = require("fs");
const validator = require("email-validator");
const { parsePhoneNumber, isValidPhoneNumber } = require("libphonenumber-js");

class Schema {

    constructor(fields) {
        this.fields = fields;
        this.errors = {};
        this.body = {};
        return this;
    }
    

    validate = (body) => {
        let schema = this.fields;

        for(const item of Object.keys(schema)) {


            this.body[item] = body[item] || null;

            // check if property exists
            if(!body.hasOwnProperty(item) && item.required) {
                this.errors[item] = `required`
                continue;
            }

            // check if field is required
            if(schema[item].required) {
                if(!body.hasOwnProperty(item)) {
                    this.errors[item] = `required`;
                    continue;
                }
                if(body[item].length <= 0) {
                    this.errors[item] = `required`;
                    continue;
                }
            } else {
                if(!body.hasOwnProperty(item)) continue;
                if(!body[item]) continue;
                if(body[item].length <= 0) continue;
            }

            if(schema[item].hasOwnProperty('min')) {
                let min = schema[item].min;
                if(body[item].length < min) {
                    this.errors[item] = `min. of ${min} characters`;
                    continue;
                }
            }

            if(schema[item].hasOwnProperty('max')) {
                let min = schema[item].max;
                if(body[item].length < min) {
                    this.errors[item] = `max. of ${min} characters`;
                    continue;
                }
            }

            

            let type = schema[item].type;
            if(!type) continue;

            switch (type) {
                case 'username':
                    let validUsername = username(body[item]);
                    if(validUsername.error) { this.errors[item] = validUsername.message; break; }     
                    break;
                case 'password':
                    let validPass = isValidPass(body[item]);
                    if(validPass.error) { this.errors[item] = validPass.message; break; }     
                    break;
                case 'number':
                    let validNum = number(body[item]);
                    if(validNum.error) { this.errors[item] = validNum.message; break; }     
                    break;
                case 'integer':
                    var regex = /^(?:[1-9][0-9]*|0)$/;
                    if(!regex.test(body[item])) {
                        this.errors[item] = 'invalid'; break;
                    }  
                    this.body[item] = Number(body[item]);
                    break;
                case 'double':
                    var regex = /^(?:[1-9][0-9]*|0)((?:[.]\d{1,2})?)$/;
                    if(!regex.test(body[item])) {
                        this.errors[item] = 'invalid'; break;
                    } 
                    this.body[item] = Number(body[item]);
                    break;
                case 'email':
                    var isValidEmail = validator.validate(body[item]);
                    if(!isValidEmail) {
                        this.errors[item] = 'invalid format'; break;
                    }
                    this.body[item] = body[item].toLowerCase();
                    break;
                case 'file':
                    let validFile = fileCheck(body[item]);
                    if(validFile.error) { this.errors[item] = validFile.message; break; }     
                    break;
                case 'pin':
                    var pattern = /^\d{6}$/;
                    if(!pattern.test(body[item])) {
                        this.errors[item] = 'must contain 6 digits'; break;
                    }
                    break;
                case 'phone':

                    try {
                        const phoneNumber = parsePhoneNumber(body[item], 'US')
                        if (phoneNumber) {
                            try {
                                this.body[item] = phoneNumber.formatInternational();
                            } catch(e) {
                                throw new Error();
                            }
                        } else {
                            throw new Error();
                        }

                    } catch(e) {
                        this.errors[item] = 'invalid format'; break;
                    }
                    
                    break;
                default:
                    break;
            }

        }

        return this;
    }


    errorCount = () => {
        return Object.keys(this.errors).length;
    }

}

const username = (val) => {
    if(val.length < 3) return { error: true, message: `min. of 3 characters` }
    if(val.length > 20) return { error: true, message: `max. of 20 characters` }
    let usernameRegex = /^[a-zA-Z0-9_\.\-]*$/;
    if(!usernameRegex.test(val)) return { error: true, message: `contains invalid characters` }
    return { error: false }
}


const isValidPass = (value) => {

    const isWhitespace = /^(?=.*\s)/;
    if (isWhitespace.test(value)) {
        return { error: true, message: `must not contain whitespaces` }
    }

    const isValidLength = /^.{8,32}$/;
    if (!isValidLength.test(value)) {
        return { error: true, message: `must be 8-32 characters Long` }
    }

    
    return { error: false }
}


const password = (val) => {
    if(val.length < 8) return { error: true, message: `min. of 8 characters` }
    if(val.length > 20) return { error: true, message: `max. of 20 characters` }
    var regex = /^[a-zA-Z0-9-+_()]*$/;
    if(!regex.test(val)) return { error: true, message: `invalid format` }
    return { error: false }
}


const fileCheck = async (val) => {
    if(!val.name) return { error: true, message: `invalid name` };
    if(!val.path) return { error: true, message: `path is required` };

    let isExists = await new Promise(resolve=>{
        fs.access("." + val.path, fs.F_OK, (err) => {
            if (err) return resolve(false);
            return resolve(true);
        })
    });

    if(!isExists) return { error: true, message: `doesn't exist` };
    
    return { error: false }
}

const number = (val) => {
    let regex = /^[+-]?\d+(\.\d+)?$/;
    if(!regex.test(val)) return { error: true, message: `invalid format` }
    return { error: false }
}

const isValidDouble = (val) => {
    var regex = /^(?:[1-9][0-9]*|0)((?:[.]\d{1,2})?)$/;
    if(!regex.test(val)) return { error: true, message: `invalid` }
    return { error: false }
}


const convertDate = (val) => {
    let valDate = moment(val).format("YYYY-MM-DD");
    let date = new Date(`${valDate}T00:00:00.000Z`);
    return date;
}

module.exports = {
    Schema,
    convertDate,
    number,
    isValidDouble
}