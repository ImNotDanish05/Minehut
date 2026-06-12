# Minehut Server Search Engine

A premium, fast, and feature-rich Minecraft server search engine and directory for the Minehut network. This tool allows users to discover community-hosted servers, inspect live player counts, view installed plugins, filter by category/plan/platform, and quickly grab connection details.

🌐 **Live Website:** [https://imnotdanish05.github.io/Minehut/](https://imnotdanish05.github.io/Minehut/)

---

## Key Features

*   🔍 **Advanced Instant Search**: Debounced real-time search that queries across server names, owner names (authors), categories, and MOTD content.
*   🎛️ **Multi-Dimensional Filters**:
    *   **Category**: Dynamically populated categories based on the currently discovered servers list (e.g. SMP, PvP, Lifesteal, Box PvP).
    *   **Platform**: Filter by Edition (Java Edition or Bedrock Edition).
    *   **Server Plan**: Dynamic grouping of server hosting plans including a consolidated filter for Custom plans.
    *   **Status Toggle**: Quick checkbox to instantly show only online servers.
*   🔢 **Dual Pagination**:
    *   Optimized to load the first **10 servers** by default.
    *   Customizable display sizes (10, 25, 50, 100 servers per page).
    *   Identical pagination controls placed at both the **top** and the **bottom** of the results grid for clean navigation.
*   🎨 **Minecraft MOTD Parser**:
    *   Supports Minecraft ampersand legacy color codes (e.g., `&a`, `&d`, `&l`).
    *   Supports hex color codes (e.g., `<#ff5555>`).
    *   Supports custom gradient spans (e.g., `<gradient:#f41643:#ff8cbd>Text</gradient>`).
*   📊 **Detailed Profile Viewers**: Clicking any server opens an in-depth dashboard showing:
    *   Uptime status, slot counts, credits per day, server version type, creation date, and total joins.
    *   Fully parsed server MOTD rendered in a stylized terminal screen.
    *   Server tags/categories and installed plugins lists.
    *   Full metadata inspector cards displaying owner username, owner ranks, and raw 24-character hexadecimal Owner IDs.
    *   Instant **"Copy Server IP"** clipboard function with visual toast confirmations.
*   ⚡ **CORS Offline Fallback**: Real-world fallback logic that detects browser CORS issues (frequent during local `file://` testing) and automatically populates the UI with a premium mock database, displaying a slide-up toast notification.

---

## Technology Stack

*   **HTML5 & CSS3 (Vanilla)**: Structured using semantic elements with responsive layouts and modern typography (`Outfit`, `JetBrains Mono` from Google Fonts).
*   **Aesthetics**: Sleek dark-mode interface with vibrant linear gradients, subtle micro-interactions, glassmorphic card overlays, and loading skeletons.
*   **JavaScript (ES6+)**: Fully modular static logic requiring no compilation or heavy node packages.
*   **Network APIs**: Direct integration with the following endpoints:
---

## File Structure

```text
Minehut/
├── .data/
│   └── list_api.txt              # API endpoint documentation & example payloads
├── detail/
│   └── index.html                # Detailed server status profile layout
├── public/
│   ├── css/
│   │   └── style.css             # Unified style definitions and responsive media queries
│   └── js/
│       ├── app.js                # Main page logic, searches, and pagination controls
│       ├── detail.js             # Detailed page data binding and copy behaviors
│       └── mock_data.js          # Premium fallback database for offline/CORS testing
├── index.html                    # Homepage containing search and filter dashboard
└── README.md                     # Project documentation
```

---

## Local Setup

Since this is a static client application, there is no build process required:

1.  Clone this repository:
    ```bash
    git clone https://github.com/imnotdanish05/Minehut.git
    ```
2.  Open the workspace folder:
    ```bash
    cd Minehut
    ```
3.  Serve the directory using any static web server (such as Python or Node) to prevent local browser CORS blocks:
    *   **Python**:
        ```bash
        python -m http.server 8000
        ```
    *   **Node.js** (`http-server`):
        ```bash
        npx http-server -p 8000
        ```
4.  Open `http://localhost:8000` in your web browser.
