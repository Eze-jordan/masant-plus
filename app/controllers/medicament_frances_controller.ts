import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import puppeteer from 'puppeteer'

export default class MedicamentFrancesController {

  /**
   * Scraper un site pour obtenir l'ID du médicament depuis le nom (par ex. "paracétamol")
   */
  public async scrapeMedicament({ request, response }: HttpContextContract) {
    try {
      // Récupérer le terme de recherche depuis la requête (par exemple "Paracétamol")
      const searchTerm = request.input('searchTerm');

      if (!searchTerm) {
        return response.badRequest({ message: 'Le terme de recherche est requis.' });
      }

      // URL de base pour la recherche
      const baseUrl = 'https://data.ansm.sante.fr/specialite';

      // Construire l'URL complète de la recherche
      const url = `${baseUrl}/${encodeURIComponent(searchTerm)}`;

      // Démarrer le navigateur avec Puppeteer
      const browser = await puppeteer.launch({
        headless: true, // Peut être false pour voir l'exécution
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // Accéder à la page de recherche avec le terme
      console.log('Accès à la page de recherche...');
      await page.goto(url, { waitUntil: 'networkidle2' }); // Attendre que la page soit complètement chargée
      console.log('Page de recherche chargée');

      // Attendre un élément spécifique pour s'assurer que la page est bien chargée
      try {
        await page.waitForSelector('.medicament-list', { timeout: 60000 }); // Attente de 60 secondes
      } catch (error) {
        console.error('Élément #rechercheMedicament introuvable après 60 secondes.');
        await browser.close();
        return response.notFound({ message: 'Aucun médicament trouvé pour ce terme.' });
      }

      // Extraire le lien de la première spécialité (médicament) de la liste de résultats
      const firstMedicamentUrl = await page.evaluate(() => {
        // @ts-ignore
        const firstMedicamentLink = window.document.querySelector('.medicament-list a');
        // @ts-ignore
        return firstMedicamentLink ? firstMedicamentLink.href : null;
      });

      if (!firstMedicamentUrl) {
        return response.notFound({ message: 'Aucun médicament trouvé pour ce terme.' });
      }

      // Extraire l'ID du médicament depuis l'URL
      const idMatch = firstMedicamentUrl.match(/specialite\/(\d+)/);
      if (!idMatch) {
        return response.badRequest({ message: 'ID du médicament non trouvé dans l\'URL.' });
      }

      const medicamentId = idMatch[1];
      console.log('ID du médicament extrait:', medicamentId);

      // Fermer le navigateur après avoir récupéré l'ID
      await browser.close();

      // Retourner l'ID du médicament
      return response.ok({
        medicamentId,
      });

    } catch (error) {
      // En cas d'erreur, retourner une réponse d'erreur
      console.error('[scrapeMedicament] Erreur :', error);
      return response.internalServerError({ message: 'Erreur serveur lors du scraping.' });
    }
  }
}
