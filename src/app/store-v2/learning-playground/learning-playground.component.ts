import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
    selector: "app-learning-playground",
    templateUrl: "./learning-playground.component.html",
    styleUrls: ["./learning-playground.component.css"],
})
export class LearningPlaygroundComponent {
    // Template-driven form model values.
    learnerName = "";
    favoriteTopic = "components";
    experienceLevel = "beginner";
    wantsNewsletter = true;
    notes = "";

    // Topics list shown in select and radios.
    readonly topics = [
        "components",
        "templates",
        "forms",
        "routing",
        "http",
        "rxjs",
    ];

    // Displayed after successful template-driven submit.
    submittedMessage = "";

    submitTemplateForm(form: NgForm): void {
        if (form.invalid) {
            return;
        }

        this.submittedMessage =
            "Nice work. You submitted a template-driven form correctly.";

        form.resetForm({
            learnerName: "",
            favoriteTopic: "components",
            experienceLevel: "beginner",
            wantsNewsletter: true,
            notes: "",
        });
    }
}
