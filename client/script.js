const API_URL = "https://invite-bot-yzx8.onrender.com";

const inviteButton = document.getElementById("inviteButton");
const inviteStatus = document.getElementById("inviteStatus");
let confirmed = false;

const setStatus = (message, isError = false) => {
  inviteStatus.textContent = message;
  inviteStatus.classList.add("visible");
  inviteStatus.classList.toggle("error", isError);
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
