      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run unit tests with pytest
        run: |
          python -m pytest tests/ -v --cov=run_agent_squad

      - name: Upload coverage reports (optional)
        if: success()
        run: |
          echo "ℹ️  Coverage upload skipped (not configured)."
          