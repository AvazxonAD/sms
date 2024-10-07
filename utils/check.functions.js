const checkValueString = (...args) => {
    args.forEach(arg => {
        if (typeof arg !== "string" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri  formatda kiritilishi kerak. String');
        }
    });
};

const checkValueNumber = (...args) => {
    args.forEach(arg => {
        if (typeof arg !== 'number' || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri formatda kiritilishi kerak. Number');
        }

        arg = arg.toString();

        if (/^\d+(\.\d+)?$/.test(arg)) {
            return true;
        }

        throw new Error('Malumotlar to`g`ri formatda kiritilishi kerak. Number');
    });
};

const checkValueBoolean = (...args) => {
    args.forEach(arg => {
        if (typeof arg !== "boolean" || arg === null || arg === undefined) {
            throw new Error('Malumotlar to`g`ri formatda kiritlishi  kerak. Boolean');
        }
    });
};

const checkValueArray = (...args) => {
    args.forEach(arg => {
        if (!Array.isArray(arg)) {
            throw new Error('Malumotlar to\'g\'ri formatda kiritilishi kerak. Array bo\'lishi lozim.');
        }
    });
};

const isValidDate = (dateString) => {
    const date = new Date(dateString);
    console.log(date)
    if (isNaN(date.getTime())) {
        throw new Error("Ma'lumotlar to'g'ri formatda kiritilishi kerak. Sana.");
    }
};

const isNotNull = (...args) => {
    args.forEach(arg => {
        if (arg === undefined || arg === null || arg === '') {
            throw new Error('Malumotlar to\'g\'ri formatda kiritilishi kerak.');
        }
    });
};

const isValidPhoneNumber = (phoneNumber) => {
    const phoneStr = String(phoneNumber);
    const regex = /^998\d{9}$/;
    const test = regex.test(phoneStr);
    if(!test){
        throw new Error('Malumotlar to\'g\'ri formatda kiritilishi kerak. Phone ustuni. Masalan : 998992996937');
    }
};

module.exports = {
    checkValueArray,
    checkValueString,
    checkValueNumber,
    checkValueBoolean,
    isValidDate,
    isNotNull,
    isValidPhoneNumber
}