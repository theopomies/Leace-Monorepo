import React from "react";
import { WebView } from "react-native-webview";

const STRIPE_PK =
  "pk_test_51NNNqUKqsAbQAwatETMGlUoLBiwWN5ZP27fCOs3YQbC76Sk5FNHN3xpdyrdD2gGIfTFFho7F5a8x8RCw8rWJXYb800BBEbzKLo";

const PaymentView = (props) => {
  const { amount, product } = props;

  const onCheckStatus = (response) => {
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

    .card-holder{
        display: flex;
        flex-direction: column;
        height: 200px;
        justify-content: space-around;
        background-color: #3D097F;
        border-radius: 20px;
        padding: 10px;
        padding-top: 20px;
        padding-bottom: 20px;
        margin-bottom: 50px;
    }
    .card-element{
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    .card-name{
        padding: 20;
        color: '#FFF';
        font-weight: 500;
        font-size: '25px';
        background-color: transparent;
        border: none;

    }

    input {
        outline:none;
        color: #FFF;
        font-size: '25px';
        font-weight: 500;
        background-color: transparent;
        }

        .row{
            margin-top: '50px';
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }

        .products-info{

            height: 150px;
            width: 100%;
            padding: 20px;
            text-align: center;
            margin-top: 100px;

        }

        .card-errors{
            color: red;
        }
        .pay-btn{
            display: flex;
            height: 50px;
            justify-content: center;
            align-items: center;
        }

    </style>

  </head>
  <body>

    <!-- product info -->
    <div class="container-fluid">
        <div class="row">
            <div class="products-info">
                Product Info: ${product}
                Amount: ${amount}
            </div>
        </div>
        <div class="row">
            <label class="card-errors" id="card-errors"></label>
        </div>

            <form>
                <div class="card-holder">
                        <input type="text" placeholder="Card Holder Name" id="card-name" class="card-name" />

                        <div id="card-element" class="card-element">

                            <div class="form-row">
                                <label>
                                    <span>Card number</span>
                                    <input type="text" size="20" data-stripe="number">
                                </label>
                            </div>

                            <div class="form-row">
                            <label>
                                <span>Expiration (MM/YY)</span>
                                <input type="text" size="2" data-stripe="exp_month">
                            </label>
                            <span> / </span>
                            <input type="text" size="2" data-stripe="exp_year">
                            </div>

                            <div class="form-row">
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
                        <input type="submit" class="btn btn-info btn-lg" value="Pay Now" />
                    </div>
            </form>
    </div>

    <script>
        var stripe = Stripe('${STRIPE_PK}');

        var elements = stripe.elements();

            var card = elements.create("card", {
                hidePostalCode: true,
                style: {
                    base: {
                    color: '#FFF',
                    fontWeight: 500,
                    fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
                    fontSize: '20px',
                    fontSmoothing: 'antialiased',
                    '::placeholder': {
                        color: '#664385',
                    },
                    ':-webkit-autofill': {
                        color: '#e39f48',
                    },
                },
                invalid: {
                    color: '#FC011F',
                    '::placeholder': {
                        color: '#FFCCA5',
                    },
                },
                }
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
  //   const htmlContent = `

  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head>
  //         <meta charset="UTF-8">
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <title>Payment Page</title>
  //         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  //         <script src="https://js.stripe.com/v3/"></script>

  //         <style>
  //         .card-holder {
  //             display: flex;
  //             flex-direction: column;
  //             justify-content: space-around;
  //             background-color: #f8f8f8; /* Light gray background */
  //             border: 1px solid #ccc; /* Gray border */
  //             padding: 20px;
  //             margin-bottom: 20px;
  //         }

  //         .card-element {
  //             display: flex;
  //             flex-direction: column;
  //         }

  //         .card-element .form-group {
  //             margin-bottom: 10px;
  //         }

  //         .card-element label {
  //             font-weight: bold;
  //         }

  //         .card-element input[type="text"] {
  //             width: 100%;
  //             padding: 10px;
  //             font-size: 16px;
  //             border: 1px solid #ccc; /* Gray border */
  //             border-radius: 4px;
  //         }

  //         .pay-btn {
  //             display: flex;
  //             justify-content: center;
  //             align-items: center;
  //         }

  //         .pay-btn input[type="submit"] {
  //           width: 160px;
  //           height: 50px;

  //             font-size: 16px;
  //             background-color: black;
  //             color: #fff;
  //             border: none;
  //             border-radius: 10px;
  //         }

  //         .prov-btn {
  //           background-color: black;
  //           color: #fff;
  //           height: 50px;
  //           width: 160px;
  //           border: none;
  //           border-radius: 10px;
  //           font-size: 16px;
  //         }
  //         </style>
  //     </head>
  //     <body>
  //         <!-- Product info -->
  //         <div class="container-fluid">
  //             <!-- Image of the product, product name, and amount -->
  //             <div class="row justify-content-center">
  //                 <div class="products-info text-center">
  //                     <img src="image_url_here" alt="Product Image" width="150">
  //                     <p>${product}</p>
  //                     <p>${amount}</p>
  //                 </div>
  //             </div>
  //             <!-- Buttons with Apple and Google logos -->
  //             <div class="row justify-content-center mt-3">
  //                 <button class=" prov-btn mr-5"> Pay</button>
  //                 <button class=" prov-btn">
  //                 <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="40" height="40" fill-rule="nonzero">
  //                 <g fill="#fff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal">
  //                 <g transform="scale(10.66667,10.66667)">
  //                 <path d="M8.994,12.242h-4.131v1.502h2.002c-0.165,0.345 -0.402,0.646 -0.691,0.89l0.001,0.001h-0.002c-0.457,0.382 -1.044,0.611 -1.686,0.611c-1.114,0 -2.065,-0.692 -2.448,-1.67c-0.117,-0.298 -0.181,-0.621 -0.181,-0.959c0,-0.545 0.166,-1.05 0.449,-1.47l0.049,-0.065c0.476,-0.664 1.251,-1.094 2.13,-1.094c0.702,0 1.341,0.274 1.81,0.725l1.254,-1.401c-0.802,-0.743 -1.88,-1.201 -3.063,-1.201c-1.555,0 -2.926,0.789 -3.737,1.987c-0.486,0.72 -0.77,1.587 -0.77,2.52c0,0.74 0.178,1.438 0.494,2.054c0.747,1.456 2.263,2.453 4.012,2.453c1.201,0 2.292,-0.469 3.1,-1.235l-0.001,-0.001c0.867,-0.818 1.408,-1.983 1.408,-3.27v-0.377zM21.045,15.353l-1.773,-4.658h1.077l1.211,3.545l1.485,-3.545h0.935c0,0 -2.9,6.842 -2.924,6.899l-0.935,0.024c0.017,-0.039 0.924,-2.265 0.924,-2.265zM18.012,13.552c0,0.577 -0.508,0.988 -1.18,0.988c-0.528,0 -0.865,-0.245 -0.865,-0.62c0,-0.387 0.324,-0.612 0.943,-0.648l1.105,-0.081zM17.095,10.695c-1.053,0 -1.832,0.581 -1.861,1.379h0.894c0.074,-0.38 0.438,-0.628 0.938,-0.628c0.606,0 0.949,0.272 0.949,0.775v0.347l-1.24,0.064c-1.151,0.067 -1.775,0.522 -1.775,1.312c0,0.798 0.643,1.328 1.565,1.328c0.623,0 1.201,-0.304 1.463,-0.786h0.02l0.003,0.786h0.915v-3.114c0.001,-0.89 -0.737,-1.463 -1.871,-1.463zM12.56,12.22h-1.221v-2.44h1.221c0.871,0 1.43,0.411 1.43,1.221c0,0.81 -0.555,1.219 -1.43,1.219zM12.852,8.865h-2.428v6.407h0.915v-2.136h1.479c1.27,0 2.182,-0.886 2.182,-2.136c0,-1.25 -0.895,-2.135 -2.148,-2.135z"/>
  //                 </g>
  //                 </g>
  //                 </svg>
  //   </button>
  //             </div>
  //             <div class="text-center my-4">
  //       <div style="display: inline-block; vertical-align: middle; width: 40%; border-top: 1px solid #ccc;"></div>
  //       <span style="padding: 0 10px;">or</span>
  //       <div style="display: inline-block; vertical-align: middle; width: 40%; border-top: 1px solid #ccc;"></div>
  //   </div>
  //             <!-- Card form -->
  //             <form>
  //                 <div class="card-holder">
  //                     <div class="card-element">
  //                     <div class="form-group">
  //                     <label for="card_name">Card Holder Name</label>
  //                     <input type="text" id="card_name" data-stripe="name" placeholder="Card Holder Name" />
  //                 </div>
  //                         <div class="form-group">
  //                             <label for="card_number">Card Number</label>
  //                             <input type="text" id="card_number" data-stripe="number" placeholder="4242 4242 4242 4242" size="19"  />
  //                         </div>

  //                         <div class="form-row">
  //         <label>
  //         <span>Expiration (MM/YY)</span>
  //         <input type="text" size="2" data-stripe="exp_month">
  //     </label>
  //     <span> / </span>
  //     <input type="text" size="2" data-stripe="exp_year">
  //     </div>

  //                         <div class="form-group">
  //                             <label for="cvc">CVC</label>
  //                             <input type="text" id="cvc" size="3" data-stripe="cvc" placeholder="CVC" />
  //                         </div>

  //                         <div class="form-row">
  //                                           <label>
  //                                               <input type="hidden" size="6" data-stripe="address_zip" value="400012">
  //                                           </label>
  //                                           </div>
  //                     </div>
  //                 </div>
  //                 <div class="pay-btn text-center">
  //                     <input type="submit" class="btn btn-primary" value="Pay Now" />
  //                 </div>
  //             </form>
  //         </div>

  //                   <script>

  //                       var stripe = Stripe('${STRIPE_PK}');

  //                       var elements = stripe.elements();

  //                           var card = elements.create("card", {
  //                               hidePostalCode: true,
  //                               style: {
  //                                   base: {
  //                                   color: '#FFF',
  //                                   fontWeight: 500,
  //                                   fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
  //                                   fontSize: '20px',
  //                                   fontSmoothing: 'antialiased',
  //                                   '::placeholder': {
  //                                       color: '#664385',
  //                                   },
  //                                   ':-webkit-autofill': {
  //                                       color: '#e39f48',
  //                                   },
  //                               },
  //                               invalid: {
  //                                   color: '#FC011F',
  //                                   '::placeholder': {
  //                                       color: '#FFCCA5',
  //                                   },
  //                               },
  //                               }
  //                           });

  //                           // Add an instance of the card Element into the 'card-element' <div>.
  //                           card.mount('#card-element');

  //                           /**
  //                            * Error Handling
  //                            */

  //                           //show card error if entered Invalid Card Number
  //                           function showCardError(error){
  //                               document.getElementById('card-errors').innerHTML = ""
  //                               if(error){
  //                                   document.getElementById('card-errors').innerHTML = error
  //                               }
  //                           }

  //                           card.on('change', function(event) {
  //                               if (event.complete) {
  //                                   showCardError()
  //                                   // enable payment button
  //                               } else if (event.error) {
  //                                   const { message} = event.error
  //                                   console.log(message)
  //                                   showCardError(message)
  //                               }
  //                           });

  //                           card.mount('#card-element');

  //                           /**
  //                            * Payment Request Element
  //                            */
  //                           var paymentRequest = stripe.paymentRequest({
  //                               country: "FR",
  //                                 currency: "eur",
  //                               total: {
  //                                   amount: ${amount * 100},
  //                                   label: "Total"
  //                               }
  //                           });

  //                           var form =  document.querySelector('form');

  //                           form.addEventListener('submit', function(e) {
  //                               e.preventDefault();

  //                               var additionalData = {
  //                                   name: document.getElementById('card-name').value,
  //                                   address_line1: undefined,
  //                                   address_city:  undefined,
  //                                   address_state: undefined,
  //                                   address_zip: undefined,
  //                               };

  //                               stripe.createToken(card, additionalData).then(function(result) {

  //                               console.log(result);

  //                               if (result.token) {
  //                                   window.postMessage(JSON.stringify(result));
  //                               } else {
  //                                   window.postMessage(JSON.stringify(result));
  //                               }
  //                           });

  //                           })

  //                   </script>

  //               </body>
  //               </html>

  //       `;

  const injectedJavaScript = `(function() {
        window.postMessage = function(data){
            window.ReactNativeWebView.postMessage(data);
        };
    })()`;

  const onMessage = (event) => {
    const { data } = event.nativeEvent;
    console.log(data);
    onCheckStatus(data);
  };

  return (
    <WebView
      javaScriptEnabled={true}
      style={{ flex: 1 }}
      originWhitelist={["*"]}
      source={{ html: htmlContent }}
      injectedJavaScript={injectedJavaScript}
      onMessage={onMessage}
    />
  );
};

export { PaymentView };
