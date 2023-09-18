import React from "react";
import { WebView } from "react-native-webview";

const STRIPE_PK =
  "pk_test_51NNNqUKqsAbQAwatETMGlUoLBiwWN5ZP27fCOs3YQbC76Sk5FNHN3xpdyrdD2gGIfTFFho7F5a8x8RCw8rWJXYb800BBEbzKLo";

const PaymentView = (props: any) => {
  const { amount, product } = props;

  const onCheckStatus = (response: any) => {
    props.onCheckStatus(response);
  };

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Page</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://js.stripe.com/v3/"></script>
    <style>
  
    * {
    margin: 0;
    padding: 0;
  }
  

    .card-holder {
        display: flex;
        flex-direction: column;
        height: 250px;
        color: #000000; /* Black text */
        padding: 10px;
        padding-top: 20px;
        padding-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      .card-name {
        color: #000000; /* Black text */
        font-weight: 500;
        border: none !important; /* Remove any existing border */
        font-size: 25px;
        border-bottom: 2px solid #ccc !important;
        padding-bottom: 10px; /* Add padding to space out the text and border */
      }
      
      input {
        outline: none;
        font-size: 25px;
        font-weight: 500;
        color: #000000; /* Black text */
        background-color: white;
         height: 60px;
        padding: 5px 10px; /* Adding padding for better visibility */
      }
      
      .row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      
      .product-card {
        justify-content: center;
        flex-direction: column;
        align-items: center;
        display: flex;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-top: 100px;
        margin-bottom: 50px;
      }
      
      /* Style for the product title */
      .product-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      /* Style for the product name */
      .product-name {
        font-size: 16px;
        margin-bottom: 5px;
      }
      
      /* Style for the product price */
      .product-price {
        font-size: 20px;
        color: #e91e63; /* Customize the color as desired */
      }
      
      .card-errors {
        color: red;
      }
      
      .pay-btn {
        display: flex;
        height: 50px;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
      }
      
      .submit {
        background-color: #60A5FACC;
        color: white
      }

.credit-card-input {
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    
    color: white;

  }

  .credit-card-input input::placeholder {
    
    color: white; /* Placeholder text color */
  }
  
  .credit-card-input label {
    font-size: 16px;
    flex: 1;
    
    margin-right: 10px;
    color: white;
  }
  
  .credit-card-input input {
    flex: 2;
    font-size: 18px;
    font-weight: 500;
    padding: 8px 12px;

    border-bottom: 1px solid #000 !important;
    color: white !important;
  }

  .card-element {
    height: 100px !important;
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    justify-content: space-around;
  }
  
  .card-element label {
    
    font-size: 16px !important;
    margin-bottom: 5px !important;
    color: white !important;
  }
  
  .card-element input {
    font-size: 18px !important;
    font-weight: 500 !important;
    padding: 8px 12px !important;
    border: none !important;
    border-bottom: 1px solid #000 !important;
    color: white !important;
  }
  
  .card-element input::placeholder {
    color: white !important;
    background-color: red;
  }

  .pay-btn {
                 display: flex;
                 justify-content: center;
                 align-items: center;
                 margin-top: 100px;
             }
  
             .pay-btn input[type="submit"] {
               width: 160px;
               height: 50px;
  
             font-size: 16px;
             background-color: black;
             color: #fff;
             border: none;
             border-radius: 10px;
         }

  .prov-btn {
               background-color: black;
               color: #fff;
               height: 50px;
               width: 160px;
               border: none;
               border-radius: 10px;
               font-size: 16px;
             }

             .form-card {
              background-color: #fff;
              padding: 20px;
              margin-bottom: 20px;
            }
      
  
    </style>
  </head>
  <body>
  <div class="container-fluid custom-container">
  <div class="product-card">
  <div class="product-info">
    <div class="product-title">Product Information:</div>
    <div class="product-name">${product}</div>
    <div class="product-price">${amount}€</div>
  </div>
</div>
   
      <div class="row">
          <label class="card-errors" id="card-errors"></label>
      </div>

        <form>
        <div class="card-holder">
            <input type="text" placeholder="Card Holder Name" id="card-name" class="card-name" />

            <div class="form-card">

            <div id="card-element" class="card-element">

            <div class="form-row credit-card-input">
            <label>
              <span>Card Number</span>
              <input type="text" size="50" data-stripe="number">
            </label>
          </div>
          
          <div class="form-row credit-card-input">
            <label>
              <span>Expiration (MM/YY)</span>
              <input type="text" size="2" data-stripe="exp_month">
            </label>
            <span> / </span>
            <input type="text" size="2" data-stripe="exp_year">
          </div>
          
          <div class="form-row credit-card-input">
            <label>
              <span>CVC</span>
              <input type="text" size="4" data-stripe="cvc">
            </label>
          </div>

                <div class="form-row">
                <label>
                    <span>Billing Zip</span>
                    <input type="hidden" size="6" data-stripe="address_zip" value="400012">
                </label>
                </div>

            </div>
        </div>

        <div class="pay-btn">
            <input type="submit" class="submit" value="Pay Now" />
        </div>
    </form>
    </div>
    </div>

    <script>
        var stripe = Stripe('${STRIPE_PK}');

        var elements = stripe.elements();

        var card = elements.create("card", {
          hidePostalCode: true,
          style: {
            base: {

              color: 'black',  // Change text color
              fontWeight: 500,
              fontFamily: 'Arial, sans-serif',  // Change font family
              fontSize: '18px',  // Change font size
              border: '1px solid #ccc',  // Add a border
              borderRadius: '5px',  // Add border radius
              padding: '10px',  // Add padding
            },
            invalid: {
              color: '#FC011F',  // Change text color for invalid input
              '::placeholder': {
                color: '#FFCCA5',  // Change placeholder text color for invalid input
              },
            },
          },
        });
        
            // Add an instance of the card Element into the 'card-element' <div>.
            card.mount('#card-element');

            /**
             * Error Handling
             */

            //show card error if entered Invalid Card Number
            function showCardError(error){
                document.getElementById('card-errors').innerHTML = ""
                if(error){
                    document.getElementById('card-errors').innerHTML = error
                }
            }

            card.on('change', function(event) {
                if (event.complete) {
                    showCardError()
                    // enable payment button
                } else if (event.error) {
                    const { message} = event.error
                    console.log(message)
                    showCardError(message)
                }
            });

            card.mount('#card-element');

            /**
             * Payment Request Element
             */
            var paymentRequest = stripe.paymentRequest({
              country: "FR",
              currency: "eur",
                total: {
                    amount: ${Math.round(amount * 100)},
                    label: "Total"
                }
            });

            var form =  document.querySelector('form');

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                var additionalData = {
                    name: document.getElementById('card-name').value,
                    address_line1: undefined,
                    address_city:  undefined,
                    address_state: undefined,
                    address_zip: undefined,
                };

                stripe.createToken(card, additionalData).then(function(result) {

                console.log(result);

                if (result.token) {
                    window.postMessage(JSON.stringify(result));
                } else {
                    window.postMessage(JSON.stringify(result));
                }
            });

            })

    </script>

  </body>
  </html>

  `;

  const injectedJavaScript = `(function() {
        window.postMessage = function(data){
            window.ReactNativeWebView.postMessage(data);
        };
    })()`;

  const onMessage = (event: any) => {
    const { data } = event.nativeEvent;
    onCheckStatus(data);
  };

  return (
    <WebView
      javaScriptEnabled={true}
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
    />
  );
};

export { PaymentView };
