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


    } else if (type === 'list') {

        field.addEventListener('blur', function() {

            if (!field.value) {

                field.classList.add('invalid_field')
                field.setCustomValidity('Selecione uma opção')
                
            } else {

                field.classList.remove('invalid_field')
                field.setCustomValidity('')

            }

        })

    }

}

async function calculate_interest() {

    const name = document.getElementById('name_input').value

    const monthly_fee_value = parseFloat(
        document.getElementById('monthly_fee_input').value.replace('.', '').replace(',', '.')
    );

    const monthly_interest_rate = parseFloat(
        document.getElementById('interest_rate_input').value.replace(',', '.')
    ) / 100; 

    const interest_rate_value = parseFloat(
        document.getElementById('interest_rate_input').value.replace(',', '.')
    );

    const contribution_time_value = parseInt(
        document.getElementById('contribution_time_select').value
    );
    
    // const monthly_interest_rate = Math.pow(1 + annual_interest_rate / 100, 1/12) - 1; 
    
    const time_value_to_months = contribution_time_value * 12;
    
    // const expr = `${monthly_fee_value} * (((1 + ${monthly_interest_rate}) ^ ${time_value_to_months} - 1) / ${monthly_interest_rate})`;

    const expr = `${monthly_fee_value} * (((1 + ${monthly_interest_rate}) ^ ${time_value_to_months} - 1) / ${monthly_interest_rate})`;
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expr: expr })
    };
    
    try {
        const response = await fetch('https://api.mathjs.org/v4/', requestOptions);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        return {
            success: true,
            result: result.result,
            name: name,
            formatted: parseFloat(result.result).toFixed(2),
            monthly_fee: monthly_fee_value,
            interest_rate: interest_rate_value,
            time_months: time_value_to_months
        };

    } catch (error) {
        console.error('Erro ao calcular:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

async function send_form() {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const result = await calculate_interest();
            
            if (result.success) {
                show_result_div(result);
            } else {
                alert(`Erro: ${result.error}`);
            }
            
        } catch (error) {
            console.error('Erro no formulário:', error);
            show_result_div({
                success: false,
                error: 'Erro ao processar o formulário'
            });
        }
    });
}

function show_result_div(result) {
    const div_result = document.querySelector('.result');
    
    if (result && result.result) {
        
        const formattedValue = parseFloat(result.result).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const monthly_to_year = result.time_months / 12;

        year = 'ano'

        if (result.time_months > 12) {

            year = 'anos'

        }
        
        div_result.innerHTML = `
            <div class="result-content">
                <h2>Resultado do Cálculo</h2>
                <p>Olá ${result.name}, investindo R$ ${result.monthly_fee} todo mês, você terá ${formattedValue} em ${monthly_to_year} ${year} sob uma taxa de juros de ${result.interest_rate}% ao mês.</p>
                <p>Valor futuro: ${formattedValue}</p>
                <button class="close-btn">Fechar</button>
            </div>
        `;
        
        div_result.querySelector('.close-btn').addEventListener('click', () => {
            div_result.classList.remove('visible');
        });
        
        div_result.classList.add('visible');
    } else {
        div_result.classList.remove('visible');
    }
}


verify_Field(name_input, 'name')
verify_Field(monthly_fee_input, 'float')
verify_Field(interest_rate_input, 'float')
verify_Field(contribution_time_select, 'list')

send_form()