# 🌌 Commit Sphere

A simple, elegant way to visualize your GitHub commits in 3D space.
<img width="2095" height="1311" alt="image" src="https://github.com/user-attachments/assets/29b8aa60-15f1-4227-993c-a12fced518f5" />

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
git clone https://github.com/your-username/commit-sphere.git
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
