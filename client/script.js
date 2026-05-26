<<<<<<< HEAD
const API_URL = window.location.origin;
=======
const API_URL = "https://invite-bot-yzx8.onrender.com";
>>>>>>> 5f01df9155c731c1a8727bc129c948465b96d659

const inviteButton = document.getElementById("inviteButton");
const inviteStatus = document.getElementById("inviteStatus");

const roomCodeInput = document.getElementById("roomCode");
const joinRoomButton = document.getElementById("joinRoomButton");
const roomHint = document.getElementById("roomHint");
const chatStatus = document.getElementById("chatStatus");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");
const imageUpload = document.getElementById("imageUpload");
const chatHelper = document.getElementById("chatHelper");
const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");
const sendImageButton = document.getElementById("sendImageButton");
const cancelImageButton = document.getElementById("cancelImageButton");

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_MESSAGE_LENGTH = 500;

let confirmed = false;
let pendingRoomId = "";
let currentRoomId = "";
let selectedImage = null;
let selectedImageDataUrl = "";

const socket = io({ autoConnect: false });

const setStatus = (message, isError = false) => {
  inviteStatus.textContent = message;
  inviteStatus.classList.add("visible");
  inviteStatus.classList.toggle("error", isError);
};

const setChatStatus = (message, isLive = false) => {
  chatStatus.textContent = message;
  chatStatus.classList.toggle("live", isLive);
};

const setChatHelper = (message) => {
  chatHelper.textContent = message || "";
};

const setChatEnabled = (enabled) => {
  chatInput.disabled = !enabled;
  sendButton.disabled = !enabled;
  imageUpload.disabled = !enabled;
  document
    .querySelector(".upload-button")
    .classList.toggle("disabled", !enabled);
};

const resetImagePreview = () => {
  selectedImage = null;
  selectedImageDataUrl = "";
  previewImage.src = "";
  imagePreview.classList.add("hidden");
  imageUpload.value = "";
};

const clearChat = () => {
  chatMessages.innerHTML = "";
};

const addMessage = ({ text, imageUrl, senderId }) => {
  const messageBubble = document.createElement("div");
  messageBubble.className = "chat-message";
  if (senderId === socket.id) {
    messageBubble.classList.add("self");
  }

  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "Shared photo";
    messageBubble.appendChild(image);
  } else {
    messageBubble.textContent = text;
  }

  chatMessages.appendChild(messageBubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

inviteButton.addEventListener("click", async () => {
  if (confirmed) return;
  confirmed = true;

  inviteButton.classList.add("confirmed");
  inviteButton.textContent = "Your Baby is coming soon";
  inviteButton.disabled = true;
  setStatus("Sent with love");

  try {
    const response = await fetch(`${API_URL}/api/invite-click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clickedAt: new Date().toISOString() }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.success) {
      setStatus("Invite could not be delivered", true);
    }
  } catch (error) {
    setStatus("Invite could not be delivered", true);
  }
});

joinRoomButton.addEventListener("click", () => {
  if (currentRoomId) {
    setChatHelper("You are already in a room.");
    return;
  }

  const roomId = roomCodeInput.value.trim();
  if (!roomId) {
    setChatHelper("Enter a room code to start.");
    return;
  }

  setChatHelper("");
  pendingRoomId = roomId;
  if (!socket.connected) {
    socket.connect();
  } else {
    socket.emit("join-room", { roomId });
  }
});

chatInput.addEventListener("input", () => {
  const trimmed = chatInput.value.trim();
  sendButton.disabled = !trimmed;
});

sendButton.addEventListener("click", () => {
  const message = chatInput.value.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!message) return;
  socket.emit("chat-message", { text: message });
  chatInput.value = "";
  sendButton.disabled = true;
});

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendButton.click();
  }
});

imageUpload.addEventListener("change", () => {
  const file = imageUpload.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setChatHelper("Please choose an image file.");
    resetImagePreview();
    return;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    setChatHelper("Image must be under 2MB.");
    resetImagePreview();
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    selectedImage = file;
    selectedImageDataUrl = reader.result;
    previewImage.src = selectedImageDataUrl;
    imagePreview.classList.remove("hidden");
    setChatHelper("");
  };
  reader.readAsDataURL(file);
});

sendImageButton.addEventListener("click", () => {
  if (!selectedImage || !selectedImageDataUrl) return;
  socket.emit("chat-image", {
    dataUrl: selectedImageDataUrl,
    name: selectedImage.name,
    type: selectedImage.type,
    size: selectedImage.size,
  });
  resetImagePreview();
});

cancelImageButton.addEventListener("click", () => {
  resetImagePreview();
});

socket.on("connect", () => {
  if (currentRoomId) {
    socket.emit("join-room", { roomId: currentRoomId });
    return;
  }

  if (pendingRoomId) {
    socket.emit("join-room", { roomId: pendingRoomId });
  }
});

socket.on("room-joined", ({ roomId, count }) => {
  currentRoomId = roomId;
  pendingRoomId = "";
  roomCodeInput.value = roomId;
  roomCodeInput.disabled = true;
  joinRoomButton.disabled = true;
  roomHint.textContent = "Share this same code to connect privately.";
  setChatEnabled(count === 2);
  if (count < 2) {
    clearChat();
  }
  setChatStatus(count === 2 ? "Live now" : "Waiting for your person...", count === 2);
  history.replaceState(null, "", `?room=${roomId}`);
});

socket.on("room-status", ({ count }) => {
  if (count < 2) {
    clearChat();
    resetImagePreview();
  }
  setChatEnabled(count === 2);
  setChatStatus(count === 2 ? "Live now" : "Waiting for your person...", count === 2);
});

socket.on("room-full", () => {
  setChatHelper("This room already has two people.");
  pendingRoomId = "";
});

socket.on("room-error", ({ message }) => {
  setChatHelper(message || "Something went wrong.");
});

socket.on("chat-message", ({ text, senderId }) => {
  addMessage({ text, senderId });
});

socket.on("chat-image", ({ dataUrl, senderId }) => {
  addMessage({ imageUrl: dataUrl, senderId });
});

socket.on("disconnect", () => {
  setChatStatus("Disconnected");
  setChatEnabled(false);
  clearChat();
});

window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get("room");
  if (roomParam) {
    roomCodeInput.value = roomParam;
  }
});

setChatStatus("Temporary chat");
setChatEnabled(false);
