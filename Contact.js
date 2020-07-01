let Verify = function (data, type) {
    type = type || null;
    data = data || null;

    function init() {
        switch (type) {
            case ('doctor') :
                return new VerifyDoctor(data);
                break;
            default:
                return new VerifyDefault(data);
                break;
        }
    }

    return init();
}

let VerifyDefault = function (data) {

    const limitAge = 18;
    let errors = [];
    this.getError = function () {
        return errors;
    }
    this.valid = false;
    data = data || null;

    this.isEmpty = function (key) {
        if (!data[key] || !(data[key] = data[key].trim())) {
            errors.push(`${key} не может быть пустым значением`);
            return true;
        }

        return false;
    }

    this.verifyName = function (key) {
        let name = data[key],
            lengthName = name.length;

        if (lengthName < 3 || lengthName > 101) {
            errors.push(`${key} не может быть меньше двух и больше 100 букв`);
            return false;
        }

        return true;
    }

    this.verifyBirthday = function () {
        let birth = new Date(data['birthday']),
            dateNow = new Date();

        if (isNaN(birth.getTime()) ||
            birth.getTime() > dateNow.getTime()
        ) {
            errors.push('Введена не корректная дата рождения');
            return false;
        }

        let age = dateNow.getFullYear() - birth.getFullYear();

        if (age < limitAge) {
            errors.push('Возраст меньше 18');
            return false;
        }
        return true;
    }

    this.verifyPhone = function (phone) {
        let regex = /^\d{3}-\d{2}-\d{2}$/;

        if (!regex.test(phone)) {
            errors.push('Введите телефон в формате 111-11-11');
            return false;
        }

        return true;
    }

    this.init = function () {
        if (!data) {
            errors.push('Введите параметры');
            return;
        }

        let notEmptyVal = !this.isEmpty('name') &&
            !this.isEmpty('lastName') &&
            !this.isEmpty('birthday') &&
            !this.isEmpty('phone');

        let validVal = this.verifyName('name') &&
            this.verifyName('lastName') &&
            this.verifyBirthday() &&
            this.verifyPhone(data['phone']);

        this.valid = notEmptyVal && validVal;
    }
}

let VerifyDoctor = function (data) {
    VerifyDefault.apply(this, arguments);
    this.init();
    this.init = function () {
        if (!this.valid) {
            return;
        }
        this.valid = !this.isEmpty('position') &&
            !this.isEmpty('jobsPhone') &&
            !this.isEmpty('educationDegree');
    }
    this.init();
}

let Info = function (data) {
    this.verifyObj = new Verify(data);

    this.verify = function () {
        let verify = this.verifyObj;
        verify.init();

        if (!verify.valid) {
            console.log(verify.getError());

            return {
                errors: verify.getError()
            };
        }
    }

    this.verify();
    this.name = data['name'];
    this.lastName = data['lastName'];
    this.phone = data['phone'];
    this.birthday = data['birthday'];

    this.getAge = function () {
        let birth = new Date(this.birthday),
            dateNow = new Date();

        return dateNow.getFullYear() - birth.getFullYear();
    }

    this.getFullName = function () {
        return `${this.name} ${this.lastName}`;
    }
}


let InfoPatient = function (data) {
    Info.apply(this, arguments);

    this.uchet = {
        isUchet: false,
        diagnoz: '',
        dateFrom: ''
    }
}

let InfoDoctor = function (data) {

    Info.apply(this, arguments);
    this.verifyObj = new Verify(data, 'doctor');
    this.verify();
    this.position = data['position'];
    this.jobsPhone = data['jobsPhone'];
    this.educationDegree = data['educationDegree'];
}

let Contact = function () {

    this.allContacts = [];

    this.addContact = function (newContact) {
        this.allContacts.push(new Info(newContact));
    }

    this.get = function (index) {
        index = index || 0;
        return this.allContacts[0];
    }

}

let doctor = new InfoDoctor({
    name: 'gsgdsgsg',
    lastName: 'dgsgsgsg',
    birthday: '2000-01-01',
    phone: '111-11-11'
});

console.log(doctor);

let patient = new InfoPatient({
    name: 'patient',
    lastName: 'dgsgsgsg',
    birthday: '2000-01-01',
    phone: '111-11-11'
});

console.log(patient);

let contact = new Contact();

contact.addContact(patient);

console.log(contact.get().name);

