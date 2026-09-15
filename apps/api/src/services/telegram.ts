import { JobEvaluationResult, JobListing, UserProfile } from '@velmurugan/shared';

export async function sendTelegramRedirectNotification(
  botToken: string,
  chatId: string,
  job: JobListing,
  evaluation: JobEvaluationResult,
  userProfile: UserProfile
): Promise<boolean> {
  if (!botToken || !chatId) {
    console.warn('Telegram Bot Token or Chat ID missing. Skipping alert.');
    return false;
  }

  const profileSummary = userProfile.experienceSummary && userProfile.experienceSummary.length > 0
    ? userProfile.experienceSummary[0]
    : `Candidate: ${userProfile.name} (${userProfile.yoe} YOE)`;

  const message = `
🚀 *Job Application Redirect Alert*

🏢 *Company*: ${escapeMarkdown(job.company)}
💼 *Role*: ${escapeMarkdown(job.title)}
📍 *Location*: ${escapeMarkdown(job.location)}
🎯 *ATS Match Score*: *${evaluation.matchScore}%*
⏳ *Required YOE*: ${escapeMarkdown(evaluation.yoeRequired)}

⚡ *Matched Skills*: ${escapeMarkdown(evaluation.matchedSkills.join(', '))}

📄 *Candidate Master Summary*:
_${escapeMarkdown(profileSummary)}_

🔗 *Direct Application Link*:
[Apply Now on Company Site](${job.url})
`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: false,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '👉 Open Application Link',
                url: job.url
              }
            ]
          ]
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Telegram API error:', errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to send Telegram message:', err);
    return false;
  }
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}
