import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { RESEND_API_KEY, RESEND_AUDIENCE_ID } from 'astro:env/server';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API_KEY);

export const server = {
	newsletter: defineAction({
		accept: 'form',
		input: z.object({
			email: z.string().email(),
		}),
		handler: async ({ email }) => {
			const { error } = await resend.contacts.create({
				email,
				audienceId: RESEND_AUDIENCE_ID,
				unsubscribed: false,
			});
			if (error) throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Subscribe failed' });
			return { ok: true };
		},
	}),

	contact: defineAction({
		accept: 'form',
		input: z.object({
			name: z.string().min(1),
			email: z.string().email(),
			subject: z.string().min(1),
			message: z.string().min(1),
		}),
		handler: async ({ name, email, subject, message }) => {
			const { error } = await resend.emails.send({
				from: 'thedev contact <hello@thedev.blog>',
				to: ['hello@thedev.blog'],
				replyTo: email,
				subject: `[contact] ${subject} — ${name}`,
				text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
			});
			if (error) throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Send failed' });
			return { ok: true };
		},
	}),
};
