
const form = document.getElementById("greetingForm");
const senderInput = document.getElementById("senderName");
const recipientInput = document.getElementById("recipientName");
const relationshipInput = document.getElementById("relationship");

const greetingList = document.getElementById("greetingList");
const emptyState = document.getElementById("emptyState");
const totalCount = document.getElementById("totalCount");

const saveButton = document.getElementById("saveButton");
const cancelEdit = document.getElementById("cancelEdit");
const formTitle = document.getElementById("formTitle");

let greetings = [];

try {
    greetings = JSON.parse(
        localStorage.getItem("diwaliGreetings") || "[]"
    );

    if (!Array.isArray(greetings)) {
        greetings = [];
    }
} catch (error) {
    console.error("Could not load saved greetings:", error);
    greetings = [];
}

let editingId = null;

const savedSender = localStorage.getItem("diwaliSenderName");

if (savedSender) {
    senderInput.value = savedSender;
}

function saveData() {
    localStorage.setItem(
        "diwaliGreetings",
        JSON.stringify(greetings)
    );

    localStorage.setItem(
        "diwaliSenderName",
        senderInput.value.trim()
    );
}

function generateId() {
    return crypto.randomUUID();
}


function getGreetingLink(id) {
    const person = greetings.find(item => item.id === id);

    if (!person) return "";

    const url = new URL("greeting.html", window.location.href);

    url.searchParams.set("id", person.id);
    url.searchParams.set("sender", person.senderName);
    url.searchParams.set("recipient", person.recipientName);
    url.searchParams.set("relationship", person.relationship);

    return url.href;
}


function renderGreetings() {
    greetingList.innerHTML = "";

    totalCount.textContent = greetings.length;

    emptyState.classList.toggle(
        "hidden",
        greetings.length > 0
    );

    greetings.forEach(person => {
        const card = document.createElement("div");
        card.className = "greeting-item";

        const info = document.createElement("div");
        info.className = "person-info";

        const name = document.createElement("h3");
        name.textContent = person.recipientName;

        const relation = document.createElement("p");
        relation.textContent =
            person.relationship + " · From " + person.senderName;

        const link = document.createElement("div");
        link.className = "link-text";
        link.textContent = getGreetingLink(person.id);

        info.append(name, relation);

        const actions = document.createElement("div");
        actions.className = "item-actions";

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy Link";
        copyBtn.addEventListener("click", () => {
            copyLink(person.id);
        });

        const shareBtn = document.createElement("button");
        shareBtn.textContent = "WhatsApp";
        shareBtn.className = "share-btn";
        shareBtn.addEventListener("click", () => {
            shareWhatsApp(person.id);
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            editGreeting(person.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            deleteGreeting(person.id);
        });

        actions.append(copyBtn, shareBtn, editBtn, deleteBtn);
        card.append(info, link, actions);

        greetingList.appendChild(card);
    });
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const senderName = senderInput.value.trim();
    const recipientName = recipientInput.value.trim();
    const relationship = relationshipInput.value;

    if (!senderName || !recipientName || !relationship) {
        alert("Please complete all fields.");
        return;
    }

    if (editingId) {
        const person = greetings.find(
            item => item.id === editingId
        );

        if (person) {
            person.senderName = senderName;
            person.recipientName = recipientName;
            person.relationship = relationship;
        }

        editingId = null;
    } else {
        greetings.push({
            id: generateId(),
            senderName,
            recipientName,
            relationship,
            createdAt: new Date().toISOString()
        });
    }

    saveData();
    renderGreetings();
    resetForm();

    alert("Greeting saved successfully!");
});

function editGreeting(id) {
    const person = greetings.find(item => item.id === id);

    if (!person) return;

    editingId = id;

    senderInput.value = person.senderName;
    recipientInput.value = person.recipientName;
    relationshipInput.value = person.relationship;

    formTitle.textContent = "Edit Greeting";
    saveButton.textContent = "Save Changes";
    cancelEdit.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function resetForm() {
    editingId = null;

    form.reset();

    const savedName = localStorage.getItem("diwaliSenderName");
    if (savedName) senderInput.value = savedName;

    formTitle.textContent = "Create a Greeting";
    saveButton.textContent = "Generate Greeting Link ↗";
    cancelEdit.classList.add("hidden");
}

cancelEdit.addEventListener("click", resetForm);

function deleteGreeting(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this greeting?"
    );

    if (!confirmed) return;

    greetings = greetings.filter(item => item.id !== id);

    saveData();
    renderGreetings();

    if (editingId === id) resetForm();
}

async function copyLink(id) {
    const link = getGreetingLink(id);

    try {
        await navigator.clipboard.writeText(link);
        alert("Greeting link copied!");
    } catch (error) {
        prompt("Copy your greeting link:", link);
    }
}

function shareWhatsApp(id) {
    const link = getGreetingLink(id);

    const message =
        "I have a special Diwali greeting for you! 🪔✨\n\n" +
        link;

    const whatsappURL =
        "https://wa.me/?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
}

renderGreetings();
