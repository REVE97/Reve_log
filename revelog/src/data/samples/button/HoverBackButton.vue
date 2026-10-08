<template>
  <button
    class="back-button"
    type="button"
  >
    <div class="back-button__icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        width="25"
        height="25"
      >
        <path
          d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
          fill="#000000"
        />
        <path
          d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
          fill="#000000"
        />
      </svg>
    </div>

    <p class="back-button__text">
      Go Back
    </p>
  </button>
</template>

<style scoped>
.back-button {
  position: relative;

  width: 192px;
  height: 56px;

  padding: 0;
  border: none;
  border-radius: 16px;

  background-color: #ffffff;
  color: #000000;

  font-size: 20px;
  font-weight: 600;

  text-align: center;
  cursor: pointer;

  overflow: hidden;
}

.back-button__icon {
  position: absolute;

  top: 4px;
  left: 4px;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  border-radius: 12px;

  background-color: #4ade80;

  transition: width 0.5s ease;
}

.back-button:hover .back-button__icon {
  width: 184px;
}

.back-button__text {
  position: relative;

  margin: 0;

  transform: translateX(8px);

  pointer-events: none;
}
</style>