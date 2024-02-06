
public class Professor extends Lecturer {
    private double bonus;

    public Professor(String name, double salary, String module, double bonus) {
        super(name, salary, module);
        this.bonus = bonus;
    }

    // Override to include the annual bonus in the salary
    @Override
    public double getAnnualSalary() {
        return roundToTwoDecimalPlaces(super.getAnnualSalary() + bonus);
    }
}
