// PDF points (72 pt/inch). Shared by the layout preview and the export.
export function imagePageLayout(width, height, { pageSize, orientation, margin }) {
  const inset = Number(margin) * 72 / 25.4
  let pageWidth = orientation === 'landscape' ? 841.89 : 595.28
  let pageHeight = orientation === 'landscape' ? 595.28 : 841.89
  if (pageSize === 'image') {
    // Use a consistent long edge; retain the image ratio independent of export quality.
    const scale = 720 / Math.max(width, height)
    pageWidth = width * scale + inset * 2
    pageHeight = height * scale + inset * 2
  }
  const scale = Math.min((pageWidth - inset * 2) / width, (pageHeight - inset * 2) / height)
  const imageWidth = width * scale
  const imageHeight = height * scale
  return {
    pageWidth, pageHeight, imageWidth, imageHeight,
    x: (pageWidth - imageWidth) / 2,
    y: (pageHeight - imageHeight) / 2,
  }
}

export function pdfFilename(value) {
  const name = value.trim().replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-').trim()
  return `${name || 'my-images'}.pdf`
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'))
    image.src = url
  })
}

export async function rotatedJpeg(blob, rotation, quality) {
  const url = URL.createObjectURL(blob)
  let canvas
  try {
    const image = await loadImage(url)
    canvas = document.createElement('canvas')
    const sideways = rotation % 180 !== 0
    canvas.width = sideways ? image.naturalHeight : image.naturalWidth
    canvas.height = sideways ? image.naturalWidth : image.naturalHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('이미지 처리 공간을 만들 수 없습니다.')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(rotation * Math.PI / 180)
    context.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)
    const result = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality))
    if (!result) throw new Error('이미지를 변환할 수 없습니다.')
    return result
  } finally {
    URL.revokeObjectURL(url)
    if (canvas) canvas.width = canvas.height = 0
  }
}
