import { BaseMail } from '@adonisjs/mail'

export default class SendoptNotification extends BaseMail {
  /**
   * The email address to send from
   */
  from = 'elieboulingui2@gmail.com' // Update this to your desired "from" address

  /**
   * The subject of the email
   */
  subject = 'Your One-Time Password (OTP)'

  /**
   * Optional: Accept dynamic data (like the OTP code or user info)
   */
  constructor(private email: string, private otp: string) {
    super()
  }

  /**
   * Prepare the message
   */
  prepare() {
    this.message
      .to(this.email)
      .from(this.from)
      .subject(this.subject)
      .html(`<p>Your OTP code is: <strong>${this.otp}</strong></p>`)
  }
}

