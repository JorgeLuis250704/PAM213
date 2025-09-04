package inicio;

import javax.swing.*;
import java.awt.*;

public class InterfazPAM extends JFrame {

    private JTextArea areaTexto;
    private InicioPAM info;  // objeto de la clase
    
    public InterfazPAM() {
        // Crear instancia de la clase
        info = new InicioPAM();

        // Configuración de la ventana
        setTitle("Inicio PAM - POO");
        setSize(500, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // Panel de botones
        JPanel panelBotones = new JPanel(new GridLayout(2, 2, 10, 10));

        JButton btnReglamento = new JButton("Reglamento POO");
        JButton btnLineamientos = new JButton("Lineamientos Classroom");
        JButton btnFechas = new JButton("Fechas de Parciales");
        JButton btnPorcentajes = new JButton("Porcentajes por Parcial");

        // Área de texto
        areaTexto = new JTextArea();
        areaTexto.setEditable(false);
        areaTexto.setFont(new Font("Arial", Font.PLAIN, 14));
        JScrollPane scroll = new JScrollPane(areaTexto);

        // Eventos
        btnReglamento.addActionListener(e -> areaTexto.setText(info.reglamentoPOO()));
        btnLineamientos.addActionListener(e -> areaTexto.setText(info.lineamientosClassroom()));
        btnFechas.addActionListener(e -> areaTexto.setText(info.fechasDeParciales()));
        btnPorcentajes.addActionListener(e -> areaTexto.setText(info.porcentajesPorParcial()));

        // Agregar botones
        panelBotones.add(btnReglamento);
        panelBotones.add(btnLineamientos);
        panelBotones.add(btnFechas);
        panelBotones.add(btnPorcentajes);

        // Agregar componentes
        add(panelBotones, BorderLayout.NORTH);
        add(scroll, BorderLayout.CENTER);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            InterfazPAM ventana = new InterfazPAM();
            ventana.setVisible(true);
        });
    }
}
