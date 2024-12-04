/**
 * 
 * @author Adam Jalyo
 * @version 3.0, Last Edited on [12/02/2024]
 * 
 * This following script function is to enhances the functionality of a textarea element with the following features:
 * 1. Removes placeholder text and changes the border color when the textarea is focused.
 * 2. Restores the placeholder text and resets the border color when the textarea loses focus.
 * 3. Displays a button when the textarea is focused and hides it when the clear button is clicked.
 * 
 */

// Select the textarea element from the document.
var feild = document.querySelector('textarea');

// Store the current value of the "placeholder" attribute from the textarea.
var backUp = feild.getAttribute('placeholder');

// Select the element with the class "btn".
var btn = document.querySelector('.btn');

// Select the element with the ID "clear".
var clear = document.getElementById('clear')

// Event handler for when the textarea gains focus (user clicks into it).
feild.onfocus = function(){
    // Remove the placeholder text by setting it to an empty string.
    this.setAttribute('placeholder', '');
    // Change the border color of the textarea to a darker color.
    this.style.borderColor = '#333';
    // Make the button with the class "btn" visible.
    btn.style.display = 'block'
}

feild.onblur = function(){
    this.setAttribute('placeholder',backUp);
    this.style.borderColor = '#aaa'
}

clear.onclick = function(){
    btn.style.display = 'none';
    feild.value = '';
}