# 🌌 Commit Sphere

A simple, elegant way to visualize your GitHub commits in 3D space.
<img width="2296" height="1371" alt="image" src="https://github.com/user-attachments/assets/58cd36fc-24a9-4b33-92a1-7551d1362275" />

---

## ✨ Overview

**Commit Sphere** is a lightweight visual experiment that maps your GitHub commits onto a rotating 3D sphere.

Right now, it focuses on one core idea:

> Turning commit history into a spatial object.

Each commit is represented as a point positioned using spherical coordinates (`theta` and `phi`), forming a complete sphere of activity that slowly rotates in space.

---

## 🧠 Concept

Instead of viewing commits as a flat list or graph, Commit Sphere treats them as **points in a 3D system**.

* Every commit → a point in space
* All points → a spherical structure
* The sphere → a visual snapshot of your activity

It’s minimal, but it sets the foundation for something more expressive.

---

## ⚙️ Current Features

* 🌍 **3D Sphere Visualization**
  Commits distributed across a sphere using `theta` and `phi`

* 🔄 **Continuous Rotation**
  The sphere slowly spins, giving a sense of motion and depth

* ⚡ **Live GitHub Data**
  Commits fetched dynamically from the GitHub API

* 🎯 **Clean, Minimal Rendering**
  Focused purely on structure and motion (no heavy UI yet)

* 🧩 **Embeddable + Persistent**

  Embed your sphere anywhere using an iframe.  
  Customize the year and color in the app `https://commit-sphere.vercel.app`, and your embed updates automatically.

  **Example:**
  ```html
  <iframe 
    src="https://commit-sphere.vercel.app/embed?user=YOUR_GITHUB_USERNAME"
    width="400"
    height="400"
    frameborder="0"
  ></iframe>
 <img width="2324" height="1398" alt="image" src="https://github.com/user-attachments/assets/7a42ad66-bd81-425e-9035-f13ca9351cb2" />
  (used 2025 because I have more commits there for better visuals 😅 )
  
---

## 🧩 Tech Stack

**Frontend**

* React
* TypeScript
* Three.js / React Three Fiber

**Backend**

* Node.js / Express
* GitHub API

---

## 🚀 Getting Started

### 1. Clone the repo

```
git clone https://github.com/simplyyliam/commit-sphere.git
cd commit-sphere
```

### 2. Install dependencies

```
cd frontend
npm install

cd ../api
npm install
```

### 3. Run the app

```
# backend
cd api
npm run dev

# frontend
cd frontend
npm run dev
```

---

## 🧭 How It Works

1. Fetch commit data from GitHub
2. Convert commits into spherical coordinates
3. Map each commit to a point in 3D space
4. Render as a rotating sphere

---

## 🔮 Future Ideas

This is just the starting point. Potential directions include:

* Highlighting commits on hover
* Clustering by repository or time
* Color-coding activity intensity
* Time-based animations (sphere evolving over time)
* Interactive exploration (zoom, filter, inspect)

---

## 🧪 Status

🚧 Early-stage experiment — currently focused on core rendering and motion.

---

## 💭 Final Thought

> This isn’t a full experience yet — it’s a foundation.

A simple rotating sphere today,
a richer, more interactive system tomorrow.

---
