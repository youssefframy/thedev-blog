---
title: "My Neovim setup, rebuilt from zero in 2026"
description: "LSP, treesitter, and a config I can actually explain. No 4,000-line init files."
pubDate: 2026-03-20
category: DevTools
tags: [devtools, neovim, editor]
glyph: "⌨"
readMins: 10
---

I nuked my Neovim config in January. I'd been copy-pasting it from machine to machine since 2021 and had no idea what half of it did. The rebuild took a weekend and I understand every line of it now.

## The philosophy

My constraints: fewer than 500 lines total, every plugin doing a job I can name, no config that exists "just in case." The config I ended up with is probably not the one you'd write — that's fine. The point is that you should understand yours.

## Plugin management with lazy.nvim

lazy.nvim is the standard in 2026. It handles lazy-loading automatically (plugins load when their filetypes or commands are invoked), and the startup time improvement is real.

My plugin list is deliberately short:
- `nvim-lspconfig` for language server configuration
- `nvim-treesitter` for syntax highlighting and navigation
- `nvim-cmp` + `cmp-nvim-lsp` for completion
- `telescope.nvim` for fuzzy finding
- `oil.nvim` for file navigation
- `mini.nvim` for everything else (pairs, statusline, comments)

That's it. No theme plugin (I wrote 30 lines of colorscheme in Lua). No AI plugin. No git integration beyond `:!git`.

## LSP configuration in 2026

Mason handles installing language servers. `nvim-lspconfig` handles configuring them. The setup is about 80 lines and supports TypeScript, Go, Rust, Python, and Lua.

The two LSP configurations I tuned beyond defaults: turning off tsserver formatting (use Prettier instead) and enabling inlay hints for Go.

## The treesitter trap

Treesitter is fantastic for highlighting and terrible for everything else until you understand it. I've seen configs that rely on treesitter for indentation, text objects, and navigation all at once. When treesitter parsers break (which they do), everything breaks.

My rule: use treesitter for highlighting and `@` text objects only. Use the built-in motion commands and the LSP for navigation.

## What I cut

The biggest cut was telescope replaced with fzf-lua for file finding. I'd been using Telescope since 2021 out of habit. fzf-lua is meaningfully faster on large projects and the configuration is simpler.

Also cut: dashboard (just start in a buffer), session management (use tmux), and any AI completion (more distraction than help for my workflow).

The config is on my GitHub if you want to read it, but I'd encourage you to write your own from scratch. The 3 hours you spend is worth more than the 3 seconds you save by copying someone else's.
