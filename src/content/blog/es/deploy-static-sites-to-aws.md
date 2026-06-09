---
title: "Automaticé la forma correcta de desplegar sitios estáticos en AWS"
description: "La forma correcta de alojar un sitio estático en AWS es un ritual de doce pasos. Lo convertí en un comando."
pubDate: 2026-06-08
category: Projects
tags: [projects, aws, cli]
glyph: "⚑"
readMins: 4
---

He desplegado suficientes sitios estáticos en AWS como para hacerlo con los ojos cerrados — y ese es exactamente el problema. Cada vez, repito el mismo ritual de doce pasos: crear un bucket S3 privado, bloquear el acceso público, configurar un Origin Access Control, levantar una distribución de CloudFront, establecer los encabezados de caché, agregar las reglas de enrutamiento de errores para SPA, esperar quince minutos, y rezar para no haber cometido un error tipográfico en alguna policy.

Nada de esto es difícil. Todo es aburrido. Y el trabajo aburrido y repetitivo que toca las políticas de seguridad es exactamente el tipo de trabajo en el que los humanos se equivocan.

## El impuesto del secure-by-default

La forma "correcta" de alojar un sitio estático en AWS no es la forma obvia. La forma obvia es un bucket S3 público con website hosting activado — y funciona, hasta que te das cuenta de que tienes un bucket abierto, sin HTTPS y sin CDN. La configuración realmente recomendada es S3 privado + CloudFront + Origin Access Control, para que el bucket nunca sea accesible públicamente y todo se sirva sobre HTTPS en el edge.

Es más seguro. También son cinco servicios más que configurar correctamente, cada vez. La mayoría de los tutoriales se detienen en la versión con bucket público porque la versión segura tiene demasiadas piezas en movimiento para caber en un artículo. Así que la gente despliega la versión insegura.

## Entonces envolví las partes aburridas en un CLI

Construí [`aws-deploy-static-site`](https://github.com/youssefframy/aws-deploy-static-site) — un pequeño CLI en Go que hace toda la configuración segura desde un único prompt interactivo. Apuntas al directorio de build, respondes unas pocas preguntas, y aprovisiona el bucket privado, el OAC, la distribución de CloudFront, los encabezados de caché y el enrutamiento de fallback para SPA.

```bash
git clone https://github.com/youssefframy/aws-deploy-static-site.git
cd aws-deploy-static-site
go run main.go
```

Pregunta si estás desplegando un sitio estático simple o una SPA, dónde están tus archivos y qué región — luego maneja el resto. Sin Terraform que aprender, sin clics en la consola, sin JSON de policy a medias recordado. Diez o quince minutos después (eso es CloudFront propagando, no yo) tienes una URL HTTPS funcionando. ¿Prefieres no instalar Go? Hay binarios precompilados para macOS, Linux y Windows en la página de releases.

## Lo que configura realmente

Detrás de los prompts, cada despliegue recibe el tratamiento secure-by-default:

- **Bucket S3 privado** con el acceso público completamente bloqueado
- **CloudFront + Origin Access Control** para que el bucket solo sea accesible a través del CDN
- **Acceso solo por HTTPS** en el edge
- **Encabezados de caché razonables** en los assets
- **Enrutamiento de errores para SPA** para que las rutas del lado del cliente dejen de dar 404

Los valores predeterminados son los seguros. Tendrías que esforzarte para desplegar algo abierto.

## Para quién es esto

No es para el mago de AWS que ya tiene un stack de CDK que ama. Es para el desarrollador que conoce su terminal, tiene las credenciales configuradas y simplemente quiere su sitio en línea sin convertirse en un arquitecto cloud a tiempo parcial. Conocimientos básicos de AWS y los permisos IAM correctos — esa es toda la barra.

## Está abierto — vengan a romperlo

Los issues y pull requests son bienvenidos de verdad. El repo es intencionalmente pequeño: alrededor de 400 líneas de Go, sin frameworks, sin magia. Si quieres agregar soporte para comportamientos de CloudFront personalizados, integración con WAF, o tu propio flujo de despliegue — la superficie es fácil de navegar. Si falla en tu entorno, abre un issue con tu región y el nombre del bucket (sin credenciales, obviamente). Lo revisaré.

## La lección

Lo construí porque estaba cansado de hacerlo a mano. Lo publiqué como open source porque todavía recuerdo lo opaco que se veía AWS la primera vez que abrí la consola. Si te ahorra una tarde de leer documentación de CloudFront — o te evita desplegar un bucket abierto — entonces hizo su trabajo.

Hay más por hacer. El siguiente artículo cubre lo que estoy construyendo a continuación para hacer esta herramienta genuinamente lista para producción — mejores mensajes de error, soporte de teardown, y algunas cosas que surgieron en el primer ciclo de uso en el mundo real. Si eso te parece útil, [suscríbete por RSS](/rss) o vuelve pronto.
