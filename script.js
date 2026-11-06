// DOM Elements
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const fetchBtn = document.getElementById('fetch-btn');
const loadingDiv = document.getElementById('loading');
const gallerySection = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');

// NASA API Key (using DEMO_KEY or your own)
const API_KEY = 'DEMO_KEY';

// Event Listener for Fetch Button
fetchBtn.addEventListener('click', () => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
        alert('Please select both a start date and an end date.');
        return;
    }

    if (startDate > endDate) {
        alert('Start date cannot be after end date.');
        return;
    }

    fetchSpaceData(startDate, endDate);
});

// Fetch Data from NASA APOD API
async function fetchSpaceData(startDate, endDate) {
    loadingDiv.classList.remove('hidden');
    gallerySection.innerHTML = '';

    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        loadingDiv.classList.add('hidden');

        if (data.code === 400) {
            alert(data.msg);
            return;
        }

        displayGallery(data);
    } catch (error) {
        loadingDiv.classList.add('hidden');
        console.error('Error fetching data:', error);
        alert('Failed to fetch space data. Please try again later.');
    }
}

// Display Gallery Cards
function displayGallery(items) {
    gallerySection.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('gallery-card');

        let mediaElement = '';
        if (item.media_type === 'image') {
            mediaElement = `<img src="${item.url}" alt="${item.title}">`;
        } else if (item.media_type === 'video') {
            mediaElement = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
        }

        card.innerHTML = `
            ${mediaElement}
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.date}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            openModal(item);
        });

        gallerySection.appendChild(card);
    });
}

// Open Modal with Detailed View
function openModal(item) {
    let mediaElement = '';
    if (item.media_type === 'image') {
        mediaElement = `<img src="${item.url}" alt="${item.title}">`;
    } else if (item.media_type === 'video') {
        mediaElement = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
    }

    modalBody.innerHTML = `
        ${mediaElement}
        <h2>${item.title}</h2>
        <p><strong>Date:</strong> ${item.date}</p>
        <p>${item.explanation}</p>
    `;

    // Remove hidden class to show modal properly
    modal.classList.remove('hidden');
}

// Close Modal Event Listeners
closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.classList.add('hidden');
    }
});
