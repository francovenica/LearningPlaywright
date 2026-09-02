import {test, expect} from '@playwright/test';

test('alta de alumno', async ({page}) => {
    await page.goto('/')
    await page.getByTestId('input-nombre').fill('Juan');
    await page.getByTestId('input-apellido').fill('Romero');
    await page.getByTestId('input-fecha-nacimiento').fill('1988-04-05');
    await page.getByTestId('input-legajo').fill('123456');
    await page.getByTestId('input-carrera').selectOption('Medicina')
    await page.getByRole('button', {name: 'Agregar alumno'}).click()

    const fila = page.getByTestId('fila-alumno').filter({hasText: 'Juan'})
    await expect(fila).toBeVisible()
    await expect(fila).toContainText('05/04/1988')
    await expect(fila).toContainText('123456')
    await expect(fila).toContainText('Medicina')
});
