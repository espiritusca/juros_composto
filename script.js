const name_input = document.getElementById('name_input')
const monthly_fee_input = document.getElementById('monthly_fee_input')
const interest_rate_input = document.getElementById('interest_rate_input')
const contribution_time_select = document.getElementById('contribution_time_select')


function verify_Field(field, type) {

    if (type === 'name') { 

        field.addEventListener('input', function() {

            this.value = this.value.replace(/[^A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]/g, '');

        });

        field.addEventListener('blur', function() {

            if (this.value.trim() === '') {

                field.classList.add('invalid_field')
                field.setCustomValidity('Preencha o campo com seu nome')

            } else {

                field.classList.remove('invalid_field')
                field.setCustomValidity('')

            }

        });

    } else if (type === 'float') {

        field.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                
                if (value.length === 1) {

                    value = '0,0' + value;

                } else if (value.length === 2) {

                    value = '0,' + value;

                } else {

                    value = value.substring(0, value.length - 2) + ',' + value.substring(value.length - 2);

                }
                
                let [intPart, decPart] = value.split(',');
                
                intPart = intPart.replace(/^0+/, '');
                
                if (intPart === '') intPart = '0';
                
                intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                
                this.value = intPart + ',' + decPart;

            } else {

                this.value = '';

            }

        });

        field.addEventListener('blur', function() {

            if (this.value.trim() === '' || parseFloat(this.value.replace(',', '.')) <= 0) {

                field.classList.add('invalid_field');
                field.setCustomValidity('O valor deve ser maior que 0');

            } else {

                field.classList.remove('invalid_field')
                field.setCustomValidity('');

            }

        });

        field.setAttribute('type', 'text');

    } else if (type === 'list') {

        field.addEventListener('blur', function() {

            if (!field.value) {

                field.classList.add('invalid_field')
                
            } else {

                field.classList.remove('invalid_field')

            }

        })

    }

}

verify_Field(name_input, 'name')
verify_Field(monthly_fee_input, 'float')
verify_Field(interest_rate_input, 'float')
verify_Field(contribution_time_select, 'list')
