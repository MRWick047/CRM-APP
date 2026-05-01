# SR Auto CRM — Optimized Structure

Bu versiya əvvəlki `srcrm.html` single-file prototipindən ayrılmış layihə strukturudur.

## Struktur

```text
srcrm_optimized/
├─ index.html
├─ assets/
│  ├─ css/
│  │  └─ main.css              # Bütün dizayn/UI style-ları
│  └─ js/
│     ├─ backend/
│     │  ├─ storage.service.js # localStorage data layer
│     │  ├─ auth.service.js    # login/register/session
│     │  └─ crm.service.js     # CRM data/business operations
│     ├─ frontend/
│     │  └─ ui.service.js      # modal/toast kimi UI helper-lər
│     └─ app/
│        └─ app.js             # mövcud səhifə renderləri və event logic
```

## Visual Studio / VS Code-da necə işlətmək olar

1. Qovluğu açın: `srcrm_optimized`
2. `index.html` faylını açın.
3. Live Server varsa, `Open with Live Server` edin.
4. Yoxdursa, `index.html` faylını brauzerdə açın.

## Gələcək dəyişiklik üçün qayda

- Dizayn dəyişmək: `assets/css/main.css`
- Login/qeydiyyat dəyişmək: `assets/js/backend/auth.service.js`
- Data saxlama üsulunu dəyişmək: `assets/js/backend/storage.service.js`
- Müştəri/sövdələşmə/tapşırıq data logic-i: `assets/js/backend/crm.service.js`
- Modal/toast UI logic-i: `assets/js/frontend/ui.service.js`
- Səhifələrin görünüş/render logic-i: `assets/js/app/app.js`

## Qeyd

Hazırda backend browser `localStorage` üzərində işləyir. Real backend əlavə ediləndə əsasən `storage.service.js`, `auth.service.js` və `crm.service.js` faylları API request-lərə uyğun dəyişdirilməlidir.
