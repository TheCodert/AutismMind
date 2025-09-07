// Function to update the sidebar position based on window size and zoom
function updateSidebarPosition() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.left = '0px';
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (windowWidth < 768) {
            sidebar.style.width = '60px';
        } else {
            sidebar.style.width = '72px';
        }

        sidebar.style.padding = `${windowHeight * 0.05}px 10px`;
    }
}

window.addEventListener('resize', updateSidebarPosition);
updateSidebarPosition();

// Modified save function with image loading handling
async function saveWhiteRectangle() {
    const whiteRectangle = document.querySelector('.white-rectangle');

    // Wait for all images to load
    const images = whiteRectangle.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => 
        img.complete ? Promise.resolve() : new Promise(resolve => { img.onload = resolve; })
    ));

    html2canvas(whiteRectangle, {
        useCORS: true,
        scale: 2,
        logging: true,
        allowTaint: false
    }).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'design-snapshot.png';
        link.click();
    }).catch(console.error);
}

document.getElementById('bntSave').addEventListener('click', saveWhiteRectangle);

// ========== ELEMENT CREATION MODIFICATIONS ========== //
const whiteRectangle = document.querySelector('.white-rectangle'); // Cache reference

// Modified GIF creation
document.getElementById('insert-gif').addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/gif';
    fileInput.style.display = 'none';

    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const gif = new Image();
            gif.onload = () => whiteRectangle.appendChild(gif); // Append to white rectangle
            gif.src = URL.createObjectURL(file);
            gif.style.position = 'absolute';
            gif.style.left = '50%';
            gif.style.top = '50%';
            gif.style.transform = 'translate(-50%, -50%)';
            
            makeGifDraggable(gif);
        }
        document.body.removeChild(fileInput);
    });
});

// Modified text creation
document.getElementById('add-text-button').addEventListener('click', () => {
    const text = prompt('Enter the text (limit of 256 characters):');
    if (text && text.length <= 256) {
        const textElement = document.createElement('div');
        textElement.textContent = text;
        textElement.className = 'draggable-text';
        textElement.style.position = 'absolute';
        textElement.style.left = '50%';
        textElement.style.top = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';
        textElement.contentEditable = true;
        
        whiteRectangle.appendChild(textElement); // Append to white rectangle
        makeTextDraggable(textElement);
    }
});

// Modified image upload
document.getElementById('upload-image-button').addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const image = new Image();
            image.onload = () => whiteRectangle.appendChild(image); // Append to white rectangle
            image.src = URL.createObjectURL(file);
            image.style.position = 'absolute';
            image.style.left = '50%';
            image.style.top = '50%';
            image.style.transform = 'translate(-50%, -50%)';
            
            makeImageDraggable(image);
        }
        document.body.removeChild(fileInput);
    });
});

// Modified button creation
function createButton() {
    buttonCounter++;
    const button = document.createElement('button');
    button.textContent = ` `;
    button.className = 'draggable-button';
    button.dataset.soundId = `sound${buttonCounter}`;
    button.style.position = 'absolute';
    button.style.left = '50%';
    button.style.top = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.classList.add('custom-button');

    const buttonImage = document.createElement('img');
    buttonImage.src = 'img/pfp.png';
    buttonImage.alt = `Button Image ${buttonCounter}`;
    button.appendChild(buttonImage);

    whiteRectangle.appendChild(button); // Append to white rectangle

    // Add context menu event for inspection
    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        selectedButton = button;
        showInspector();
        document.getElementById('button-text').value = button.textContent;
    });

    // Update button image on change
    document.getElementById('button-image').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && selectedButton) {
            const imageUrl = URL.createObjectURL(file);
            const buttonImage = selectedButton.querySelector('img');
            if (buttonImage) {
                buttonImage.src = imageUrl;
            }
        }
    });

    // Add mousedown event for dragging
    button.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            startDrag(e, button);
            button.classList.add('button-button-grow');
        }
    });

    // Add click event to play sound
    button.addEventListener('click', () => {
        if (!isButtonDragging) {
            playSound(button);
        }
    });

    // Add mouseup event to remove animation
    button.addEventListener('mouseup', () => {
        button.classList.remove('button-button-grow');
    });

    // Associate the default sound with this button
    buttonSounds[button.dataset.soundId] = '';
    makeButtonDraggable(button);
}

// ========== DRAGGABLE FUNCTIONS ========== //
function makeGifDraggable(gif) {
    gif.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
            e.preventDefault();
            selectedImage = gif; // Set the selected image
            showImageInspector(); // Show the inspector for resizing
        } else {
            isDraggingGif = true;
            offsetX = e.clientX - gif.getBoundingClientRect().left;
            offsetY = e.clientY - gif.getBoundingClientRect().top;
            currentGif = gif;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingGif && currentGif === gif) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            gif.style.left = `${x}px`;
            gif.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDraggingGif = false;
        currentGif = null;
    });
}

function makeTextDraggable(textElement) {
    textElement.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
            e.preventDefault();
            deleteText(textElement);
        } else {
            isDraggingText = true;
            currentText = textElement;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingText && currentText === textElement) {
            const x = e.clientX - textElement.offsetWidth / 2;
            const y = e.clientY - textElement.offsetHeight / 2;
            textElement.style.left = `${x}px`;
            textElement.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDraggingText = false;
        currentText = null;
    });
}

function makeImageDraggable(image) {
    image.addEventListener('mousedown', (e) => {
        if (e.button === 2) {
            e.preventDefault();
            selectedImage = image; // Set the selected image
            showImageInspector(); // Show the inspector for resizing
        } else {
            isDraggingImage = true;
            offsetX = e.clientX - image.getBoundingClientRect().left;
            offsetY = e.clientY - image.getBoundingClientRect().top;
            currentImage = image;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingImage && currentImage === image) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            image.style.left = `${x}px`;
            image.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDraggingImage = false;
        currentImage = null;
    });
}

// ========== IMAGE RESIZING FUNCTIONALITY ========== //
function showImageInspector() {
    const inspector = document.getElementById('image-inspector');
    inspector.style.display = 'block';
    document.getElementById('toggle-image-inspector').textContent = 'Minimize';
}

function hideImageInspector() {
    const inspector = document.getElementById('image-inspector');
    inspector.style.display = 'none';
    document.getElementById('toggle-image-inspector').textContent = 'Maximize';
}

// Event to save the image based on the specified width and height values
document.getElementById('save-image-button').addEventListener('click', () => {
    const widthInput = document.getElementById('image-width-input');
    const heightInput = document.getElementById('image-height-input');
    const newWidth = widthInput.value + 'px';
    const newHeight = heightInput.value + 'px';

    // Resize the image based on the specified width and height values
    if (selectedImage) {
        selectedImage.style.width = newWidth;
        selectedImage.style.height = newHeight;
    }

    // Hide the image inspector
    hideImageInspector();
});

// Event to delete the image
document.getElementById('delete-image-button').addEventListener('click', () => {
    if (selectedImage) {
        selectedImage.remove();
        hideImageInspector();
    }
});

// ========== HELPER FUNCTIONS ========== //
function deleteGif(gif) {
    if (confirm('Are you sure you want to delete this GIF?')) {
        gif.remove();
    }
}

function deleteText(textElement) {
    if (confirm('Are you sure you want to delete this text?')) {
        textElement.remove();
    }
}

function deleteImage(image) {
    if (confirm('Are you sure you want to delete this image?')) {
        image.remove();
    }
}

function showInspector() {
    const inspector = document.getElementById('inspector');
    inspector.style.display = 'block';
    document.getElementById('toggle-inspector').textContent = 'Minimize';
}

function playSound(button) {
    if (button) {
        const soundId = button.getAttribute('data-sound-id');
        const audio = document.getElementById('audio-player');
        audio.src = buttonSounds[soundId] || '';
        audio.play();
    }
}

// ========== INITIALIZATION ========== //
let buttonCounter = 0;
let inspectorMinimized = false;
let isDragging = false;
let isButtonDragging = false;
let offsetX = 0;
let offsetY = 0;
let currentButton = null;
const buttonSounds = {};

let isDraggingImage = false;
let currentImage = null;

let isDraggingText = false;
let currentText = null;

let isDraggingGif = false;
let currentGif = null;

document.getElementById('bntQuit').addEventListener('click', () => {
    window.location.href = "index.html";
});

document.getElementById('bntLogout').addEventListener('click', () => {
    window.location.href = "login.html";
});

document.getElementById('add-button').addEventListener('click', createButton);