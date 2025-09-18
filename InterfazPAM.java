package uni;

import javax.swing.*;
import java.awt.*;
import uni.inicioPAM;

public class interfazPAM extends JFrame {

    private inicioPAM datos;

    public InterfazPAM() {
        datos = new inicioPAM();

        setTitle("Información POO");
        setSize(500, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        JPanel panel = new JPanel(new BorderLayout());

        JTextArea textoArea = new JTextArea();
        textoArea.setEditable(false);
        textoArea.setFont(new Font("Arial", Font.PLAIN, 14));
        JScrollPane scroll = new JScrollPane(textoArea);
        panel.add(scroll, BorderLayout.CENTER);

        JPanel panelBotones = new JPanel(new GridLayout(1, 4, 5, 5));
        JButton btnReglamento = new JButton("Reglamento");
        JButton btnLineamientos = new JButton("Classroom");
        JButton btnFechas = new JButton("Parciales");
        JButton btnPorcentajes = new JButton("Porcentajes");

        panelBotones.add(btnReglamento);
        panelBotones.add(btnLineamientos);
        panelBotones.add(btnFechas);
        panelBotones.add(btnPorcentajes);

        panel.add(panelBotones, BorderLayout.SOUTH);

        // Conectar botones con los métodos de inicioPAM
        btnReglamento.addActionListener(e -> textoArea.setText(datos.reglamentoPOO()));
        btnLineamientos.addActionListener(e -> textoArea.setText(datos.lineamientosClassroom()));
        btnFechas.addActionListener(e -> textoArea.setText(datos.fechasDeParciales()));
        btnPorcentajes.addActionListener(e -> textoArea.setText(datos.porcentajesPorParcial()));

        add(panel);
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new InterfazPAM());
    }
}
