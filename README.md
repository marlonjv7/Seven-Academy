# Seven Academy Landing v2

Landing page React + Vite para Seven Academy con formulario de misioneros, almacenamiento en Supabase y redirección a WhatsApp.

## Configuración incluida

- WhatsApp: `573245575413`
- Supabase URL: `https://ebiuuazunywdilleuoae.supabase.co`
- Favicon SVG del 7
- Logo horizontal SVG para navbar
- Supabase actualizado para usar `VITE_SUPABASE_PUBLISHABLE_KEY`

## Único dato que debes completar

La captura de Supabase oculta parte de la clave con `...`, por lo que no es posible reconstruirla de forma segura.

1. Ve a **Supabase > Settings > API Keys**.
2. En **Publishable key**, pulsa el icono de copiar.
3. Abre `.env`.
4. Sustituye:

```env
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REEMPLAZA_CON_LA_CLAVE_COMPLETA
```

por la clave completa copiada desde Supabase.

> No uses `Secret key`, `service_role`, `Legacy JWT Secret` ni una JWT Signing Key en el frontend.

## Crear la tabla

En Supabase abre **SQL Editor > New query**, pega el contenido de `supabase-schema.sql` y ejecútalo una sola vez.

La política RLS incluida permite insertar formularios desde la web pública, pero no leer, editar ni borrar registros desde el navegador.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Validar producción

```bash
npm run build
npm run preview
```

## Vercel

Al desplegar en Vercel agrega estas tres variables en **Project Settings > Environment Variables**:

```env
VITE_WHATSAPP_NUMBER=573245575413
VITE_SUPABASE_URL=https://ebiuuazunywdilleuoae.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_COMPLETA
```
