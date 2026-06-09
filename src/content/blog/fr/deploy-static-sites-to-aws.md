---
title: "J'ai automatisé la bonne façon de déployer des sites statiques sur AWS"
description: "La bonne façon d'héberger un site statique sur AWS est un rituel en douze étapes. J'en ai fait une commande."
pubDate: 2026-06-08
category: Projects
tags: [projects, aws, cli]
glyph: "⚑"
readMins: 4
---

J'ai déployé suffisamment de sites statiques sur AWS pour le faire les yeux fermés — et c'est exactement le problème. À chaque fois, je rejoue le même rituel en douze étapes : créer un bucket S3 privé, bloquer l'accès public, câbler un Origin Access Control, monter une distribution CloudFront, paramétrer les en-têtes de cache, ajouter les règles de routage d'erreur pour les SPA, attendre quinze minutes, et prier pour ne pas avoir fait de faute de frappe dans une policy.

Rien de difficile là-dedans. Tout est ennuyeux. Et le travail ennuyeux et répétitif qui touche aux politiques de sécurité, c'est exactement le genre de chose où les humains se plantent.

## La taxe du secure-by-default

La "bonne" façon d'héberger un site statique sur AWS n'est pas la façon évidente. La façon évidente, c'est un bucket S3 public avec website hosting activé — et ça marche, jusqu'au moment où on réalise qu'on a un bucket ouvert, pas de HTTPS, et pas de CDN. La configuration vraiment recommandée, c'est S3 privé + CloudFront + Origin Access Control, pour que le bucket ne soit jamais accessible publiquement et que tout soit servi en HTTPS à la périphérie.

C'est plus sécurisé. C'est aussi cinq services supplémentaires à configurer correctement, à chaque fois. La plupart des tutoriels s'arrêtent à la version avec bucket public parce que la version sécurisée a trop de pièces mobiles pour tenir dans un article. Du coup, les gens livrent la version non sécurisée.

## J'ai donc encapsulé les parties ennuyeuses dans un CLI

J'ai construit [`aws-deploy-static-site`](https://github.com/youssefframy/aws-deploy-static-site) — un petit CLI Go qui fait toute la configuration sécurisée depuis une seule invite interactive. On lui pointe le dossier de build, on répond à quelques questions, et il provisionne le bucket privé, l'OAC, la distribution CloudFront, les en-têtes de cache et le routage de fallback SPA.

```bash
git clone https://github.com/youssefframy/aws-deploy-static-site.git
cd aws-deploy-static-site
go run main.go
```

Il demande si on déploie un site statique simple ou une SPA, où se trouvent les fichiers, et quelle région — puis il gère le reste. Pas de Terraform à apprendre, pas de clics dans la console, pas de JSON de policy à moitié mémorisé. Dix à quinze minutes plus tard (c'est CloudFront qui propage, pas moi), on a une URL HTTPS fonctionnelle. Vous préférez ne pas installer Go ? Des binaires pré-compilés pour macOS, Linux et Windows sont disponibles sur la page des releases.

## Ce que ça configure réellement

Derrière les invites, chaque déploiement reçoit le traitement secure-by-default :

- **Bucket S3 privé** avec accès public entièrement bloqué
- **CloudFront + Origin Access Control** pour que le bucket ne soit accessible que via le CDN
- **Accès HTTPS uniquement** à la périphérie
- **En-têtes de cache sensés** sur les assets
- **Routage d'erreur SPA** pour que les routes côté client arrêtent de faire des 404

Les valeurs par défaut sont les valeurs sécurisées. Il faudrait faire un effort pour déployer quelque chose d'ouvert.

## Pour qui c'est

Ce n'est pas pour le wizard AWS qui a déjà un stack CDK qu'il adore. C'est pour le développeur qui maîtrise son terminal, a des credentials configurées, et veut juste son site en ligne sans devenir un architecte cloud à mi-temps. Des connaissances AWS de base et les bonnes permissions IAM — c'est tout ce qu'on demande.

## C'est ouvert — venez le casser

Les issues et pull requests sont sincèrement les bienvenus. Le repo est intentionnellement petit : environ 400 lignes de Go, pas de frameworks, pas de magie. Si vous voulez ajouter le support de comportements CloudFront personnalisés, l'intégration WAF, ou votre propre workflow de déploiement — la surface est facile à explorer. Si ça plante sur votre setup, ouvrez une issue avec votre région et le nom du bucket (sans les credentials, évidemment). Je regarderai.

## La leçon

J'ai construit ça parce que j'en avais assez de le faire à la main. Je l'ai mis en open source parce que je me souviens encore à quel point AWS semblait opaque la première fois que j'ai ouvert la console. Si ça vous fait gagner un après-midi de lecture de docs CloudFront — ou vous évite de déployer un bucket ouvert — alors il a fait son travail.

Il y a encore du chemin. Le prochain article couvre ce que je construis ensuite pour rendre cet outil vraiment prêt pour la production — de meilleurs messages d'erreur, le support de teardown, et quelques points qui sont remontés lors de la première utilisation en conditions réelles. Si ça vous intéresse, [abonnez-vous via RSS](/rss) ou revenez bientôt.
