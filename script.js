const apiKey = "DEMO_KEY"; // Replace with your NASA API key if needed
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const fetchBtn = document.getElementById("fetch-btn");
const loadingEl = document.getElementById("loading");
const galleryEl = document.getElementById("gallery");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");

fetchBtn.addEventListener("click", () => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (!startDate || !endDate) {
        alert("Please select both a start and end date!");
        return;
    }

    fetchSpaceData(startDate, endDate);
});

function fetchSpaceData(start, end) {
    loadingEl.classList.remove("hidden");
    galleryEl.innerHTML = "";

    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${start}&end_date=${end}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            loadingEl.classList.add("hidden");
            if (data.code) {
                alert(data.msg);
                return;
            }
            displayGallery(data);
        })
        .catch(error => {
            loadingEl.classList.add("hidden");
            console.error("Error fetching data:", error);
            alert("Failed to fetch space data. Please try again.");
        });
}

function displayGallery(items) {
    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("gallery-card");

        let mediaContent = "";
        if (item.media_type === "video") {
            mediaContent = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            mediaContent = `<img src="${item.url}" alt="${item.title}">`;
        }

        card.innerHTML = `
            ${mediaContent}
            <div class="card-info">
                <h3>${item.title}</h3>
                <p>${item.date}</p>
            </div>
        `;

        card.addEventListener("click", () => {
            openModal(item);
        });

        galleryEl.appendChild(card);
    });
}

function openModal(item) {
    let mediaContent = "";
    if (item.media_type === "video") {
        mediaContent = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
    } else {
        mediaContent = `<img src="${item.url}" alt="${item.title}">`;
    }

    modalBody.innerHTML = `
        ${mediaContent}
        <h2>${item.title}</h2>
        <p><strong>${item.date}</strong></p>
        <p>${item.explanation}</p>
    `;
    modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});
