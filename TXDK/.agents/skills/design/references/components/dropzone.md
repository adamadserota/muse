# Dropzone

File upload area — drag-and-drop or click to browse.

## Structure

Dashed border container with upload icon, label, and file type hint. File list below after upload.

## Tokens

- **BG (default):** `bg-white-5` (`#0D1D25`)
- **BG (hover/drag-over):** `bg-white-10` (`#192931`)
- **Border:** `border-2 border-dashed border-white-20` (`#334148`)
- **Border (drag-over):** `border-primary-100` (`#33FFFF`)
- **Icon:** `text-white-40` 24px, centered
- **Label:** `text-sm text-white-60` — "Drop files here or click to browse"
- **Hint:** `text-xs text-white-40` — "PNG, JPG, PDF up to 10MB"
- **Padding:** `p-8` centered content
- **Min height:** `min-h-[160px]`

## File List

- **File item:** `flex items-center gap-2 p-2 bg-white-5 border border-white-20`
- **Filename:** `text-sm text-white-100 truncate`
- **File size:** `text-xs text-white-40`
- **Remove button:** icon button `text-error-100` on hover
- **Progress bar:** `h-1 bg-primary-100` during upload

## States

- **Default:** dashed border, muted icon + text
- **Hover:** brighter BG
- **Drag-over:** cyan border, BG shift
- **Uploading:** progress bar per file
- **Error:** `border-error-100` + error message `text-xs text-error-100`
- **Disabled:** `opacity-50 cursor-not-allowed`

## Rules

- Validate file type and size before upload
- Show preview thumbnails for images
- Multiple files: list below the dropzone
- Keyboard: Enter/Space opens file dialog
